const mongoose = require("mongoose");
const { bank } = require("../Controller/bankController");
const ObjectId = mongoose.Schema.Types.ObjectId;

const withdraw = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true },
    orderId: { type: String, require: true },
    amount: { type: Number, require: true },
    ordernumberGateway: { type: Number },
    transactionId: { type: String },
    type: { type: String, default:"bank_transfer"}, // bank transerfer, upi etc
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "failed", "completed"],
    }, // pending, failed and completed
    orderTime: { type: Date, default: Date.now },
    successTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("withdraw", withdraw);
