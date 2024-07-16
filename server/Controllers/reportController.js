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
      const page = req.query.page || 1;
      const limit = 15;
      const skip = (page - 1) * limit;

      const filters = {};

      if (req.query.year) {
        const years = req.query.year.split("_").map((year) => Number(year));
        filters.year = { $in: years };
      }

      if (req.query.author) {
        const authors = req.query.author.split("_");
        filters.author = { $in: authors };
      }

      if (req.query.sector) {
        const sectors = req.query.sector.split("_");
        filters.sector = { $in: sectors };
      }

      if (req.query.subSector) {
        const subSectors = req.query.subSector.split("_");
        filters.subSector = { $in: subSectors };
      }

      if (req.query.searchQuery) {
        const searchRegex = { $regex: req.query.searchQuery, $options: "i" };
        const matchingAuthors = await authorController.getMatchingAuthor(searchRegex);
        const matchingSectors = await sectorController.getMatchingSector(searchRegex);
        const matchingSubSectors = await subsectorController.getMatchingSubSector(searchRegex);


        const authorIds = matchingAuthors.map((author) => author.aid);
        const sectorIds = matchingSectors.map((sector) => sector.sid);
        const subSectorIds = matchingSubSectors.map((subSector) => subSector.ssid);

        filters.$or = [
          { title: searchRegex },
          { author: { $in: authorIds } },
          { sector: { $in: sectorIds } },
          { subSector: { $in: subSectorIds } },
          { tags: { $elemMatch: { $regex: req.query.searchQuery, $options: "i" } } }
        ];
      }

      const reports = await reportModel
        .find(filters)
        .skip(skip)
        .limit(limit)
        .sort({ rid: 1 });

      const transformedReports = await Promise.all(
        reports.map(async (report) => {
          const authorName = await authorController.getAuthorNames(
            report.author
          );
          const sectorName = await sectorController.getSectorName(
            report.sector
          );
          const subSectorName = await subsectorController.getSubSectorName(
            report.subSector
          );
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
      console.log(err);
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
      const transformedReports = await Promise.all(
        reportData.map(async (report) => {
          const authorName = await authorController.getAuthorNames(
            report.author
          );
          const sectorName = await sectorController.getSectorName(
            report.sector
          );
          const subSectorName = await subsectorController.getSubSectorName(
            report.subSector
          );
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
      return res.status(200).json(transformedReports[0]);
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  
}

module.exports = new ReportController();
