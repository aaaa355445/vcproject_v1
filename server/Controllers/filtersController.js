const subSectorService = require("./subsectorController");
const sectorService = require("./sectorController");
const authorService = require("./authorController");

class FilterController {
  async getAllFilters(req, res) {
    try {
      const [authors, sectors, subSectors] = await Promise.all([
        authorService.getAllAuthors(req, res),
        sectorService.getAllSectors(req, res),
        subSectorService.getAllSubSectors(req, res),
      ]);
      return res.status(200).json({
        authors,
        sectors,
        subSectors,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong!!" });
    }
  }
}

module.exports = new FilterController();
