const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    rid: {type: Number, required: true, unique: true, index: true},
    title: { type: String, required: true, index: true },
    author: [{ type: Number, ref: 'Author', index: true }],
    sector: { type: Number, ref: 'Category', index: true },
    subSector: { type: Number, ref: 'Subcategory', index: true },
    image: { type: String, required: true },
    link: { type: String, required: true },
    year: { type: Number, required: true, index: true },
    month: { type: String, required: true }
}, { timestamps: true });


module.exports = mongoose.model('Report', reportSchema, 'report');