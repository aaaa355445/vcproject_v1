// const ReportModel = require("../Models/reports-model");

// class ReportsController {
//   async upload(req, res) {
//     try {
//       const {
//         title,
//         year,
//         month,
//         authors,
//         author_type,
//         category,
//         subcategory,
//         reportlink,
//         market,
//         thumbnail,
//       } = req.body;

//       if (
//         !title ||
//         !authors ||
//         !category ||
//         !subcategory ||
//         !reportlink ||
//         !thumbnail
//       ) {
//         return res.status(400).json({ message: "All fields are required!" });
//       }

//       const newReport = new ReportModel({
//         title,
//         year,
//         month,
//         author: authors && typeof authors === 'string' ? authors.split(',').map(author => author.trim()) : [authors],
//         author_type: author_type && typeof author_type === 'string' ? author_type.split(',').map(type => type.trim()) : [author_type],
//         category,
//         subcategory,
//         reportlink,
//         market,
//         thumbnail,
//       });
//       await newReport.save();

//       return res.status(200).json({
//         newReport,
//         message: "Report added successfully!",
//       });
//     } catch (err) {
//       console.log(err);
//       return res.status(500).json({ message: "Something went wrong!!" });
//     }
//   }

//   async getAllReport(req, res) {
//     try {
//       let filter = {};

//       if (req.query.category) {
//         filter.category = req.query.category;
//       }
  
//       if (req.query.subcategory) {
//         filter.subcategory = req.query.subcategory;
//       }
  
//       if (req.query.year) {
//         filter.year = req.query.year;
//       }

//       if (req.query.selectedAuthors) {
//         filter.author = { $in: req.query.selectedAuthors };
//       }

//       const reports = await ReportModel.find(filter);

//       return res.status(200).json({
//         message: "Here are the reports!",
//         reports,
//       });
//     } catch (err) {
//       console.log(err);
//       return res.status(500).json({ message: "Something went wrong!" });
//     }
//   }
// }

// module.exports = new ReportsController();
