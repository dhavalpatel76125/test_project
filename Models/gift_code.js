const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const gift = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true },
    giftCode:{type:String,required:true},
    expireAt:{ type: Date, require:true },
    amount:{type:Number,require:true},
    status:{type: String,enum: ["Success", "Not_Redeem", "Failed"]} , // failed by cron job after the expire date
    redeemCount:{type:Number, require:true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("gift", gift);
