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

  async getOtherFiltersFromAuthors(req, res) {
    const authorIds = req.body.authorIds;

    if (!authorIds || !Array.isArray(authorIds) || authorIds.length === 0) {
      return res.status(400).json({ message: "Author IDs are required and should be an array!" });
    }

    try {
      // Fetch authors by IDs
      const authors = await authorService.getAuthorsByIds(authorIds);

      // Extract sector and subsector IDs
      const sectorIds = [];
      const subSectorIds = [];

      authors.forEach(author => {
        if (Array.isArray(author.sid)) {
          author.sid.forEach(sectorId => {
            if (!sectorIds.includes(sectorId)) {
              sectorIds.push(sectorId);
            }
          });
        }

        if (Array.isArray(author.ssid)) {
          author.ssid.forEach(subSectorId => {
            if (!subSectorIds.includes(subSectorId)) {
              subSectorIds.push(subSectorId);
            }
          });
        }
      });

      // Fetch sectors and subsectors by IDs
      const [sectors, subSectors] = await Promise.all([
        sectorService.getSectorsByIds(sectorIds),
        subSectorService.getSubSectorsByIds(subSectorIds),
      ]);
      
      // Return the fetched sectors and subsectors
      return res.status(200).json({
        sectors,
        subSectors
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong!!" });
    }
  }

  async getOtherFiltersFromSector(req, res) {
    const sectorIds = req.body.sectorIds;

    if (!sectorIds || !Array.isArray(sectorIds) || sectorIds.length === 0) {
      return res.status(400).json({ message: "Sector IDs are required and should be an array!" });
    }

    try {
      // Fetch authors by IDs
      const sector = await sectorService.getsectors(sectorIds);

      // Extract sector and subsector IDs
      const subSectorIds = [];

      sector.forEach(sector => {
        if (Array.isArray(sector.ssid)) {
          sector.ssid.forEach(subSectorId => {
            if (!subSectorIds.includes(subSectorId)) {
              subSectorIds.push(subSectorId);
            }
          });
        }
      });

      // Fetch sectors and subsectors by IDs
      const [subSectors] = await Promise.all([
        subSectorService.getSubSectorsByIds(subSectorIds),
      ]);
      
      // Return the fetched sectors and subsectors
      return res.status(200).json({
        subSectors
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong!!" });
    }
  }
}

module.exports = new FilterController();
