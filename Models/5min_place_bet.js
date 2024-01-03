// 30SecLottery.js
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const lottery5MinSchema = new mongoose.Schema({
  LN: { type: Number, required: true,},  // Lottary Number
  userId:{type:ObjectId,ref: "User",required:true},
  orderNumber:{type:String,require:true},
  phrchaseAmount:{type:Number,require:true},
  amountAfterTax:{type:Number,require:true},
  tax:{type:Number,require:true},
  selectType: {
    type: String,
    enum: ["number", "color", "size"],
  },
  result:{
    color: [{ type: String}],
    number: { type: String },
    size: { type: String },
  },
  win_loss:{
    type:String,
    default: 0
  },
  select:{type:String,require:true},
  status:{type:String, enum:["pending","success", "failed"], default: "pending"},
  orderTime: { type: Date, default: Date.now },
},{timestamps:true});

module.exports = mongoose.model('5_min_user_bet', lottery5MinSchema);