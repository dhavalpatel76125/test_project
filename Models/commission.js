// DEPOSITE COUNT , RECENT DEPOSITE AMOUNT ,

const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const commission = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true },
    direct: {
      number_of_register: {
        type: Number,
        default: 0,
      },
      deposit_number: {
        type: Number,
        default: 0,
      },
      deposit_amount: {
        type: Number,
        default: 0,
      },
      deposit_first_time_count: {
        type: Number,
        default: 0,
      },
    },
    team: {
      number_of_register: {
        type: Number,
        default: 0,
      },
      deposit_number: {
        type: Number,
        default: 0,
      },
      deposit_amount: {
        type: Number,
        default: 0,
      },
      deposit_first_time_count: {
        type: Number,
        default: 0,
      },
    },
    total_commission: {
      type: Number,
      default: 0,
    },
    bet_commission: {
      type: Number,
      default: 0,
    },
    deposit_commission: {
      type: Number,
      default: 0,
    },
    withdraw_amount: {
      type: Number,
      default: 0,
    },
    withdraw_history: [
      {
        orderId: { type: String },
        amount: { type: Number },
        transactionId: { type: String },
        status: {
          type: String,
          default: "pending",
          enum: ["pending", "failed", "completed"],
        }, // pending, failed and completed
        successTime: { type: Date, default: Date.now },
      },
    ],
    results: [
      {
        amount: {
          type: Number,
        },
        type: {
          type: String,
          enum: ["deposit", "bet"],
        },
        date: {
          type: Date,
          default: Date.now(),
        },
        rate: {
          type: Number,
          default: 0,
        },
      },
    ],
    downline: [
      {
        userId: { type: ObjectId, ref: "User", required: true },
        joinDate: {
          type: Date,
        },
      },
    ],
    referalCode: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("commission", commission);
