const authorModel = require("../Models/authorModel");

class AuthorController {
  async upload(req, res) {
    try {
      const authors = req.body?.authors.map((author) => ({
        aid: author.aid,
        name: author.name
      }));

      if (!authors || authors.some(author => !author.aid || !author.name)) {
        return res.status(400).json({ message: "All fields are required!" });
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
  };

  async getAllAuthors(req, res) {
    try {
      const authors = await authorModel.find({}).sort({name:1});
      return res.status(200).json(authors);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong!!' });
    }
  };

  async getAuthorNames(aids) {
    try {
      const authors = await authorModel.find({ aid: { $in: aids } });
      const authorNames = authors.map(author => author.name);
      return authorNames;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong!!");
    }
  }
  
  
}

module.exports = new AuthorController();
