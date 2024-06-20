const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportLogSchema = new Schema({
    rid: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    totalCount: { type: Number, default: 0 },
    logs: [{
        email: { type: String },
        guestId: { type: String },
        count: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }]
  }, { timestamps: true });

module.exports = mongoose.model('ReportLogs', reportLogSchema, 'reportLogs');
