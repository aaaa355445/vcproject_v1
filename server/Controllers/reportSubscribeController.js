const reportSubscribeModel = require("../Models/reportSubscribeModel");

class ReportSubscribeController {
    async saveEmail(req, res) {
      try {
        const { email, guestId } = req.body;  
        if (!email) {
          return res.status(400).json({ message: "Email is required!" });
        }
  
        const newSubscriber = new reportSubscribeModel({ email, guestId });
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

    async checkEmailForGuestUser(req, res) {
      try {
        const { guestId } = req.query;
        if (!guestId) {
          return res.status(400).json({ message: "Guest user not present." });
        }
  
        const newSubscriber = await reportSubscribeModel.findOne({guestId});
        console.log(newSubscriber.email)
        let emailExists = false;
        if (newSubscriber){
          emailExists = true;
        }
        return res.status(200).json({
          emailExists,
          email: newSubscriber.email
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong!!" });
      }
    }
  
  }
  
  module.exports = new ReportSubscribeController();
  