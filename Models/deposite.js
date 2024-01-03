// DEPOSITE COUNT , RECENT DEPOSITE AMOUNT ,

const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const deposite = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true },
    orderNumber: { type: String, require: true },
    amount: { type: Number, require: true },
    ordernumberGateway: { type: String },
    transactionId: { type: String },
    type: {
      type: String,
      require: true,
      enum: ["rebate", "commission", "upi", "bank", "card"],
    }, // bank transerfer, upi etc
    status: {
      type: String,
      require: true,
      default: "pending",
      enum: ["pending", "failed", "completed"],
    }, // pending, failed and completed this is change on verify after that amount will be deposite to user wallet
    // depositCount: { type: Number, default: 0 }, //this count increase when deposit status is success
    // recentDepositeAmount: { type: Number, require: true }, // add the deposite amount when added to account
    orderTime: { type: Date, default: Date.now },
    successTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("deposite", deposite);
