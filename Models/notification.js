const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const notification = new mongoose.Schema(
  {
    public: [{
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      date: {
        type: Date,
      },
    }],
    private: [{
      userId: { type: ObjectId, ref: "User" },
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      date: {
        type: Date,
      },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("notification", notification);
