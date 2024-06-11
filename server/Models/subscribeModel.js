const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscribeSchema = new Schema({
    email: { type: String, required: true, unique: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Subscribe', subscribeSchema, 'subscribe');
