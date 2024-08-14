const reportEmailModel = require("../Models/reportEmail");
const emailService = require("../Services/emailService");

class SearchEmailController {
  async saveEmail(req, res) {
    try {
      const { email, reportTopic } = req.body;

      if (!email) {
        return res.status(200).json({ message: "Email is required!" });
      } else if (!reportTopic) {
        return res.status(200).json({ message: "Enter Report Topic" });
      }

      const newReportTopic = new reportEmailModel({ email, reportTopic });
      const savedReportTopic = await newReportTopic.save();
      emailService.sendEmail({
        to: ["sidharthv605@gmail.com", "choudharynandini1@gmail.com", "chetanyaarora009@gmail.com", "mittalayush740@gmail.com "],
        subject: "You have a new query",
        text: `This is the query:\n"${reportTopic}"\n${email}\nrequested this query.`
      });

      return res.status(200).json({
        savedReportTopic,
        message: "Your query has been shared with our experts. You can expect a response within 48 hours.",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong!!" });
    }
  }
}

module.exports = new SearchEmailController();
