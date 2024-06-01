const contactModel = require('../Models/contactModel');

class ContactController {
  async saveContact(req, res) {
    try {
      const { name, email, checklist, description } = req.body;

      if (!name || !email || !checklist || !description) {
        return res.status(400).json({ message: 'All fields are required!' });
      }

      const newContact = new contactModel({ name, email, checklist, description });
      const savedContact = await newContact.save();

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
