const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchLogSchema = new Schema({
    guestId: { type: String, required: true, unique: true},
    searchQuery: [{ type: String }],
  }, { timestamps: true });

module.exports = mongoose.model('SearchLogs', searchLogSchema, 'searchLogs');
