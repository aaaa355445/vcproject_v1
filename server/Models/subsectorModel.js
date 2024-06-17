const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subsectorSchema = new Schema({
    ssid: {type: Number, required: true, unique: true, index: true},
    name: { type: String, required: true, index: true },
    sid: { type: Number, ref: 'Sector', index: true },
    aid: [{ type: Number, ref: 'Author', index: true }],
}, { timestamps: true });


module.exports = mongoose.model('Subsector', subsectorSchema, 'subsector');