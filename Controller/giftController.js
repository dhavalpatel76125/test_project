const User = require("../Models/User"); // Ensure to replace with the actual path
const Gift = require("../Models/gift_code"); // Ensure to replace with the actual path
const logger = require("../Services/logger");
const log = require('../utility/logStyle')

const addGift = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { userId, giftCode, expireAt, amount } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      logger.error("error: User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new gift entry
    const newGift = new Gift({
      userId: ObjectId(userId),
      giftCode,
      expireAt: new Date(expireAt),
      amount,
      status: "Not_Redeem", // Initial status
      redeemCount: 0, // Initial redeem count
    });

    // Save the gift entry in the database
    await newGift.save();

    // Send the response
    res.status(201).json(newGift);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const redeemGift = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { userId, giftCode } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      logger.error("error: User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the gift code exists
    const gift = await Gift.findOne({ giftCode, userId, status: "Not_Redeem" });

    if (!gift) {
      logger.error("error: Gift code not found or already redeemed");
      return res
        .status(404)
        .json({ error: "Gift code not found or already redeemed" });
    }

    // Update the gift entry to mark it as redeemed
    gift.status = "Redeemed";
    gift.redeemCount += 1;

    // In a real scenario, you might want to perform additional actions here,
    // such as updating the user's account with the gift amount.

    // Save the updated gift entry in the database

    // update user wallet rangeToWithdraw
    await gift.save();

    // Send the response
    res.json({
      success: true,
      message: "Gift code successfully redeemed",
      redeemedGift: gift,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const withdrawGiftCard = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { userId, giftCode } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      logger.error("error: User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the gift code exists
    const gift = await Gift.findOne({ giftCode, userId, status: "Redeemed" });

    if (!gift) {
      logger.error("error: Gift code not found or already redeemed");
      return res
        .status(404)
        .json({ error: "Gift code not found or not eligible for withdrawal" });
    }

    // Perform the withdrawal action (replace this with your actual withdrawal logic)
    // For example, you might add the gift amount to the user's account.

    // Update the gift entry to mark it as withdrawn
    gift.status = "Withdrawn";

    // Save the updated gift entry in the database
    await gift.save();

    // Send the response
    res.json({
      success: true,
      message: "Gift card successfully withdrawn",
      withdrawnGift: gift,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addGift, redeemGift, withdrawGiftCard };
