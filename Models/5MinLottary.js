// 30SecLottery.js
const mongoose = require("mongoose");

const lottery5MinSchema = new mongoose.Schema({
  LN: { type: Number, required: true, unique: true },  // Lottary Number
  color: [{ type: String, required: true }],
  number: { type: String, required: true },
  size: { type: String, required: true },
},{timestamps:true});

module.exports = mongoose.model('5_min_result', lottery5MinSchema);
