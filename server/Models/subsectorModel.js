const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subsectorSchema = new Schema({
    ssid: {type: Number, required: true, unique: true, index: true},
    sid: { type: Number, ref: 'Sector' },
    name: { type: String, required: true, index: true }
})


module.exports = mongoose.model('Subsector', subsectorSchema, 'subsector');