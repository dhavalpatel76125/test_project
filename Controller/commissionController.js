const logger = require("../Services/logger");
const Commission = require('../Models/commission')
const User = require("../Models/User");
const log = require('../utility/logStyle')

const getcommission = async (req, res) => {
  try {
  } catch (err) {
    logger.error(err.message);
  }
};

const getcommissionByUser = async (req, res) => {
    try {
      const userId = req.userId;

    // Find the user by ID using Mongoose
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const commission = await Commission.findOne({userId:userId})
    return res.status(404).json({ "data": commission });
    } catch (err) {
      logger.error(err.message);
    }
  };

module.exports = { getcommission, getcommissionByUser };
