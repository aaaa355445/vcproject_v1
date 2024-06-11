const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSubscribeSchema = new Schema({
    email: { type: String, required: true },
    guestId: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('ReportSubscribe', reportSubscribeSchema, 'reportSubscribe');
