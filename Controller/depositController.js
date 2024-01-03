const logger = require("../Services/logger");
const Deposit = require("../Models/deposite");
const User = require("../Models/User");
const log = require('../utility/logStyle')

const deposit = async (req, res) => {
  try {
    const {
      orderNumber,
      amount,
      orderNumberGateway,
      transactionId,
      type,
      status,
      recentDepositeAmount,
    } = req.body;

    // Validate request parameters
    if (
      !orderNumber ||
      !amount ||
      !type ||
      !status ||
      !recentDepositeAmount
    ) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Ensure that the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new deposit instance
    const newDeposit = new Deposit({
      userId,
      orderNumber,
      amount,
      orderNumberGateway,
      transactionId,
      type,
      status,
      recentDepositeAmount,
    });

    // Save the deposit to the database
    const savedDeposit = await newDeposit.save();

    // Update user's wallet if the deposit status is 'completed'
    if (status === "completed") {
      await User.updateOne(
        { _id: userId },
        { $inc: { wallet: recentDepositeAmount } }
      );
    }

    res.status(201).json(savedDeposit); // 201 Created
  } catch (err) {
    logger.error(err.message);
  }
};

const getDeposit = async (req, res) => {
  try {
    // Retrieve all deposits from the database
    const allDeposits = await Deposit.find();

    res.json({ success: true, data: allDeposits });
  } catch (err) {
    logger.error(err.message);
  }
};

const getDepositByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Retrieve deposits by user ID from the database
    const userDeposits = await Deposit.find({ userId });

    res.json({ success: true, data: userDeposits });
  } catch (err) {
    logger.error(err.message);
  }
};

module.exports = { deposit, getDeposit, getDepositByUser };
