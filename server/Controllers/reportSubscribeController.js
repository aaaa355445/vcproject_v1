const reportSubscribeModel = require("../Models/reportSubscribeModel");

class ReportSubscribeController {
    async saveEmail(req, res) {
      try {
        const { email } = req.body;
  
        if (!email) {
          return res.status(400).json({ message: "Email is required!" });
        }
  
        const newSubscriber = new reportSubscribeModel({ email });
        const savedSubscriber = await newSubscriber.save();
  
        return res.status(200).json({
          savedSubscriber,
          message: "Welcome to the club!",
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong!!" });
      }
    }
  
  }
  
  module.exports = new ReportSubscribeController();
  