
const mongoose = require("mongoose");

const lottery1MinSchema = new mongoose.Schema({
  LN: { type: Number, required: true, unique: true },  // Lottary Number
  color: [{ type: String, required: true }],
  number: { type: String, required: true },
  size: { type: String, required: true },
},{timestamps:true});

module.exports = mongoose.model('1_min_result', lottery1MinSchema);
