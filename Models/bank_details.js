const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const bankDetail = new mongoose.Schema(
  {
    userId:{type:ObjectId,ref: "User",required:true},
    bankName: { type: String, required: true },
    acountNumber: { type: Number, required: true },
    ifscCode: { type: String, required: true },
    phoneNumber: { type: Number, required: true }, // level of the current user
    Name: { type: String, required: true }, // object id of user who refer
  },
  { timestamps: true }
);

module.exports = mongoose.model("bank_details", bankDetail);

