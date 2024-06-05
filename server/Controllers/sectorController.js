const sectorModel = require("../Models/sectorModel");

class SectorController {
  async upload(req, res) {
    try {
      const sectors = req.body?.sectors.map((sector) => ({
        sid: sector.sid,
        name: sector.name
      }));

      if (!sectors || sectors.some(sector => !sector.sid || !sector.name)) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      const savedSector = await sectorModel.insertMany(sectors);

      return res.status(200).json({
        savedSector,
        message: "Sectors Added Successfully",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong!!" });
    }
  };

  async getAllSectors(req, res) {
    try {
      const sectors = await sectorModel.aggregate([
        {
          $lookup: {
            from: "report",
            localField: "sid",
            foreignField: "sector",
            as: "reports",
          },
        },
        {
          $project: {
            sid: 1,
            name: 1,
            totalReports: { $size: "$reports" },
          },
        },
        {
          $sort: { name: 1 },
        },
      ]);
      return res.status(200).json({
        sectors
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong!!" });
    }
  };

  async getSectorName(sid) {
    try {
      const sectorName = await sectorModel.findOne({sid});
      return sectorName.name;
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong!!" });
    }
  }

}

module.exports = new SectorController();
