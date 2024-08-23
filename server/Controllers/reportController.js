const reportModel = require("../Models/reportModel");
const sectorController = require("./sectorController");
const subsectorController = require("./subsectorController");
const authorController = require("./authorController");

class ReportController {
  async upload(req, res) {
    try {
      const {
        rid,
        title,
        author,
        sector,
        subSector,
        image,
        link,
        year,
        month,
        tags,
      } = req.body;
  
      if (
        !rid ||
        !title ||
        !author ||
        !sector ||
        !subSector ||
        !image ||
        !link ||
        !year ||
        !month ||
        !tags
      ) {
        return res.status(400).json({ message: "All fields are required!" });
      }
  
      const existingReport = await reportModel.findOne({ rid });
      if (existingReport) {
        return res
          .status(400)
          .json({ message: "Report with this RID already exists!" });
      }
  
      const newReport = new reportModel({
        rid,
        title,
        author,
        sector,
        subSector,
        image,
        link,
        year,
        month,
        tags,
      });
  
      const savedReport = await newReport.save();
  
      return res.status(200).json({
        savedReport,
        message: "Report Added Successfully",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong!!" });
    }
  }
  

  async getReports(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 15;
      const skip = (page - 1) * limit;
  
      const filters = {}; // Initialize filters for AND logic
      const orFilters = []; // Initialize array for OR logic
  
      // Handle "year" filter
      if (req.query.year) {
        const years = req.query.year.split("_").map((year) => Number(year));
        filters.year = { $in: years };
      }
  
      // Handle "author" filter
      if (req.query.author) {
        const authors = req.query.author.split("_");
        orFilters.push({ author: { $in: authors } });
      }
  
      // Handle "sector" filter
      if (req.query.sector) {
        const sectors = req.query.sector.split("_");
        orFilters.push({ sector: { $in: sectors } });
      }
  
      // Handle "subSector" filter
      if (req.query.subSector) {
        const subSectors = req.query.subSector.split("_");
        orFilters.push({ subSector: { $in: subSectors } });
      }
  
      // Handle "searchQuery" filter with regex
      if (req.query.searchQuery) {
        const searchRegex = { $regex: req.query.searchQuery, $options: "i" };
        const matchingAuthors = await authorController.getMatchingAuthor(searchRegex);
        const matchingSectors = await sectorController.getMatchingSector(searchRegex);
        const matchingSubSectors = await subsectorController.getMatchingSubSector(searchRegex);
  
        const authorIds = matchingAuthors.map((author) => author.aid);
        const sectorIds = matchingSectors.map((sector) => sector.sid);
        const subSectorIds = matchingSubSectors.map((subSector) => subSector.ssid);
  
        orFilters.push(
          { title: searchRegex },
          { author: { $in: authorIds } },
          { sector: { $in: sectorIds } },
          { subSector: { $in: subSectorIds } },
          { tags: { $elemMatch: { $regex: req.query.searchQuery, $options: "i" } } }
        );
      }
  
      // Determine if we should use AND or OR logic
      const finalQuery = orFilters.length > 0 ? { $or: orFilters, ...filters } : filters;
    
      // Fetch reports with the constructed query
      const reports = await reportModel
        .find(finalQuery)
        .skip(skip)
        .limit(limit)
        .sort({ rid: 1 });
  
      console.log("Reports fetched from DB:", reports.length);
  
      // Transform reports to include related names
      const transformedReports = await Promise.all(
        reports.map(async (report) => {
          const authorName = await authorController.getAuthorNames(report.author);
          const sectorName = await sectorController.getSectorName(report.sector);
          const subSectorName = await subsectorController.getSubSectorName(report.subSector);
          return {
            rid: report.rid,
            title: report.title,
            year: report.year,
            month: report.month,
            author: authorName,
            sector: sectorName,
            subSector: subSectorName,
            link: report.link,
            image: report.image,
          };
        })
      );
  
      return res.status(200).json({ reports: transformedReports });
    } catch (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).json({ message: "Something went wrong!!" });
    }
  }
    
  async getYearCount(req, res) {
    try {
      const yearlyCounts = await reportModel.aggregate([
        { $group: { _id: "$year", count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
      ]);
  
      const result = yearlyCounts.map(({ _id, count }) => ({ year: _id.toString(), totalReport: count }));
  
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  async getReportDetails(req, res) {
    try {
      const reportData = await reportModel.find({rid: req.params.rid});
      if (!reportData) {
        return res.status(404).send('Report not found');
      }

      const mainReport = reportData[0];
      const transformedReport = await transformReport(mainReport);

      const similarReports = await reportModel.aggregate([
        { $match: { sector: mainReport.sector, rid: { $ne: mainReport.rid } } },
        { $sample: { size: 5 } }
      ]);

      const transformedSimilarReports = await Promise.all(
        similarReports.map(transformReport)
      );

      return res.status(200).json({
        ...transformedReport,
        similarReports: transformedSimilarReports
      });
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
  
}

async function transformReport(report) {
  const authorName = await authorController.getAuthorNames(report.author);
  const sectorName = await sectorController.getSectorName(report.sector);
  const subSectorName = await subsectorController.getSubSectorName(report.subSector);
  return {
    rid: report.rid,
    title: report.title,
    year: report.year,
    month: report.month,
    author: authorName,
    sector: sectorName,
    subSector: subSectorName,
    link: report.link,
    image: report.image
  };
}

module.exports = new ReportController();
