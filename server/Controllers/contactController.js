const contactModel = require('../Models/contactModel');
const emailService = require("../Services/emailService");

class ContactController {
  async saveContact(req, res) {
    try {
      const { name, email, checklist, description } = req.body;

      if (!name || !email || !checklist || !description) {
        return res.status(400).json({ message: 'All fields are required!' });
      }

      const newContact = new contactModel({ name, email, checklist, description });
      const savedContact = await newContact.save();

      emailService.sendEmail({
        to: ["mittalayush740@gmail.com", "sidharthv605@gmail.com"],
        subject: "Someone contacted us - The VC PRoject",
        text: `Hello,\nName- ${name}\nEmail- ${email}\nChecklist- ${checklist}\nDescription- ${description}`
      });

      return res.status(200).json({
        savedContact,
        message: 'Ayush & Sidharth have been notified',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong!!' });
    }
  }
}

module.exports = new ContactController();
