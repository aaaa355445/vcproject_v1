const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportEmailSchema = new Schema({
    email: { type: String, required: true },
    reportTopic: [{type: String, required: true}],
}, { timestamps: true });

module.exports = mongoose.model('ReportEmail', reportEmailSchema, 'reportEmail');
