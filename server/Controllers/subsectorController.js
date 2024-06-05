const subsectorModel = require("../Models/subsectorModel");

class SubsectorController {
  async upload(req, res) {
    try {
      const subsectors = req.body?.subsectors.map((subsector) => ({
        ssid: subsector.ssid,
        sid: subsector.sid,
        name: subsector.name,
      }));

      if (
        !subsectors ||
        subsectors.some(
          (subsector) => !subsector.ssid || !subsector.sid || !subsector.name
        )
      ) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      const savedSubsectors = await subsectorModel.insertMany(subsectors);

      return res.status(200).json({
        savedSubsectors,
        message: "Subsectors Added Successfully",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong!!" });
    }
  }

  async getSubSectorsBySectorIds(req, res) {
    try {
      const sectorIds = req.body.sectorIds;
  
      if (!sectorIds || !Array.isArray(sectorIds) || sectorIds.length === 0) {
        return res.status(400).json({ message: "Sector IDs are required and should be an array!" });
      }

      const normalizedSectorIds = sectorIds.map(id => Number(id));  

      const subsectors = await subsectorModel.aggregate([
        {
          $match: {
            sid: { $in: normalizedSectorIds }
          }
        },
        {
          $lookup: {
            from: "report",
            localField: "ssid",
            foreignField: "subSector",
            as: "reports",
          },
        },
        {
          $project: {
            ssid: 1,
            name: 1,
            totalReports: { $size: "$reports" },
          },
        },
        {
          $sort: { name: 1 }
        }
      ]);
  
      return res.status(200).json({
        subsectors,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong!!" });
    }
  }
  
  async getSubSectorName(ssid) {
    try {
      const subSectorName = await subsectorModel.findOne({ssid});
      return subSectorName.name;
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong!!" });
    }
  }
}

module.exports = new SubsectorController();
