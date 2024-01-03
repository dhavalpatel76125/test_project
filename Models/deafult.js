
const mongoose = require("mongoose");

const def = new mongoose.Schema({
},{timestamps:true});

module.exports = mongoose.model('default', def);
