const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    inviteCode: { type: String },
    level: { type: Number, required: true }, // level of the current user
    uid: { type: String, required: true, unique: true },
    referalUserCode: { type: String }, // object id of user who refer
    wallet: { type: Number, required: true },
    rangeToWithdraw: { type: Number, required: true, min: 0 },
    language: { type: String, default: "en" }, // Provide a default language
    username: { type: String },
    resetOtp: {
      otp: {
        type: Number,
      },
      expirAt: {
        type: Date,
      },
      resetToken:{
         type: String,
          default: null 
        },
      resetTokenExpires:{
         type: Date, 
         default: null 
        },
    },
    user_level: {
      level: {
        type: Number,
        default: 0,
      },
      total_bet_amount: {
        type: Number,
        default: 0,
      },

      levels: {
        1: {
          rebate_rate: {
            type: Number,
            default: 0.05,
          },
          level_reward: {
            type: Boolean,
            default: false,
          },
          monthly_reward: {
            type: Boolean,
            default: false,
          },
        },
        2: {
          rebate_rate: {
            type: Number,
            default: 0.1,
          },
          level_reward: {
            type: Boolean,
            default: false,
          },
          monthly_reward: {
            type: Boolean,
            default: false,
          },
        },
        3: {
          rebate_rate: {
            type: Number,
            default: 0.15,
          },
          level_reward: {
            type: Boolean,
            default: false,
          },
          monthly_reward: {
            type: Boolean,
            default: false,
          },
        },
        4: {
          rebate_rate: {
            type: Number,
            default: 0.2,
          },
          level_reward: {
            type: Boolean,
            default: false,
          },
          monthly_reward: {
            type: Boolean,
            default: false,
          },
        },
        5: {
          rebate_rate: {
            type: Number,
            default: 0.25,
          },
          level_reward: {
            type: Boolean,
            default: false,
          },
          monthly_reward: {
            type: Boolean,
            default: false,
          },
        },
        6: {
          rebate_rate: {
            type: Number,
            default: 0.3,
          },
          level_reward: {
            type: Boolean,
            default: false,
          },
          monthly_reward: {
            type: Boolean,
            default: false,
          },
        },
        7: {
          rebate_rate: {
            type: Number,
            default: 0.35,
          },
          level_reward: {
            type: Boolean,
            default: false,
          },
          monthly_reward: {
            type: Boolean,
            default: false,
          },
        },
        8: {
          rebate_rate: {
            type: Number,
            default: 0.4,
          },
          level_reward: {
            type: Boolean,
            default: false,
          },
          monthly_reward: {
            type: Boolean,
            default: false,
          },
        },
        9: {
          rebate_rate: {
            type: Number,
            default: 0.45,
          },
          level_reward: {
            type: Boolean,
            default: false,
          },
          monthly_reward: {
            type: Boolean,
            default: false,
          },
        },
        10: {
          rebate_rate: {
            type: Number,
            default: 0.4,
          },
          level_reward: {
            type: Boolean,
            default: false,
          },
          monthly_reward: {
            type: Boolean,
            default: false,
          },
        },
      },
      rebate_amount: {
        type: Number,
        default: 0,
      },
      exp: {
        type: Number, // 1rs = 1 exp
        default: 0,
      },
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

//module.exports = User;
