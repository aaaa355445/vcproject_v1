const authorModel = require("../Models/authorModel");
const subSectorService = require("./subsectorController");
const sectorService = require("./sectorController");

class AuthorController {
  // For Admin
  async upload(req, res) {
    try {
      const authors = req.body?.authors.map((author) => ({
        aid: author.aid,
        name: author.name,
        sid: author.sid, // Assuming sid is provided as an array of numbers
        ssid: author.ssid, // Assuming ssid is provided as an array of numbers
      }));
  
      if (!authors || authors.some((author) => !author.aid || !author.name || !Array.isArray(author.sid) || !Array.isArray(author.ssid))) {
        return res.status(400).json({ message: "All fields are required and sid and ssid should be arrays!" });
      }
  
      const savedAuthors = await authorModel.insertMany(authors);
  
      return res.status(200).json({
        savedAuthors,
        message: "Authors Added Successfully",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong!!" });
    }
  }
  

  // For Bassic Filter
  async getAllAuthors() {
    try {
      const authors = await authorModel
        .aggregate([
          {
            $lookup: {
              from: "report",
              localField: "aid",
              foreignField: "author",
              as: "reports",
            },
          },
          {
            $project: {
              aid: 1,
              name: 1,
              totalReports: { $size: "$reports" },
            },
          },
          {
            $sort: { name: 1 },
          },
        ]);
        return authors;
    } catch (err) {
      console.error(err);
    }
  }

  // For reports
  async getAuthorNames(aids) {
    try {
      const authors = await authorModel.find({ aid: { $in: aids } });
      const authorNames = authors.map((author) => author.name);
      return authorNames;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong!!");
    }
  }

  // For search
  async getMatchingAuthor(searchRegex) {
    try{
      return await authorModel.find({ name: searchRegex });
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong!!");
    }
  }

  async getAuthorsByIds(authorIds) {
    try {
      const authors = await authorModel.find({ aid: { $in: authorIds } });
      return authors;
    } catch (err) {
      console.error(err);
      throw new Error("Something went wrong!!");
    }
  }
}

module.exports = new AuthorController();
