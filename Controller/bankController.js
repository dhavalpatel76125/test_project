const mongoose = require("mongoose");
const logger = require("../Services/logger");
const BankDetail = require("../Models/bank_details");
const log = require('../utility/logStyle')

const bank = async (req, res) => {
  try {
    const { userId, bankName, acountNumber, ifscCode, phoneNumber, Name } =
      req.body;

    // Validate the input parameters
    if (
      !userId ||
      !bankName ||
      !acountNumber ||
      !ifscCode ||
      !phoneNumber ||
      !Name
    ) {
      return res.status(400).json({ error: "All parameters are required" });
    }

    // Create a new bank detail instance
    const newBankDetail = new BankDetail({
      userId,
      bankName,
      acountNumber,
      ifscCode,
      phoneNumber,
      Name,
    });

    // Save the bank detail to the database
    const savedBankDetail = await newBankDetail.save();

    return res.json({ success: true, data: savedBankDetail });
  } catch (err) {
    console.error("Error in bank API:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getbank = async (req, res) => {
  try {
    // Retrieve all bank details from the database
    const allBankDetails = await BankDetail.find();

    res.json({ success: true, data: allBankDetails });
  } catch (err) {
    logger.error(err.message);
  }
};

const getbankByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate the user ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Retrieve bank details by user ID from the database
    const bankDetails = await BankDetail.find({ userId });

    res.json({ success: true, data: bankDetails });
  } catch (err) {
    logger.error(err.message);
  }
};

module.exports = { bank, getbank, getbankByUser };
