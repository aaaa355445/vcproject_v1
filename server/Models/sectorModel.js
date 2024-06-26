const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectorSchema = new Schema({
    sid: {type: Number, required: true, unique: true, index: true},
    name: { type: String, required: true, index: true },
    aid: [{ type: Number, ref: 'Author', index: true }],
    ssid: [{ type: Number, ref: 'SubSector', index: true }],

}, { timestamps: true });


module.exports = mongoose.model('Sector', sectorSchema, 'sector');