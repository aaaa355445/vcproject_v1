const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    aid: {type: Number, required: true, unique: true, index: true},
    name: { type: String, required: true, index: true }
})


module.exports = mongoose.model('Author', authorSchema, 'authors');