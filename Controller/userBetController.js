const thirty_sec_user_bet = require("../Models/30sec_place_bet");
const one_min_user_bet = require("../Models/1min_place_bet");
const three_min_user_bet = require("../Models/3min_place_bet");
const five_min_user_bet = require("../Models/5min_place_bet");

const thirty_sec_lottery = require("../Models/30SecLottary");
const one_min_lottery = require("../Models/1MinLottary");
const three_min_lottery = require("../Models/3MinLottary");
const five_min_lottery = require("../Models/5MinLottary");

const logger = require("../Services/logger");
const log = require('../utility/logStyle')

const User = require("../Models/User");

const generateUniqueOrderId = require("../utility/randamOrderId");
const commission = require("../Models/commission");

const ThirtySecBets = async (req, res) => {
  try {
    const { LN, phrchaseAmount, selectType, select } = req.body;
    console.log(req.body)
    const userId = req.userId;

    // Find the user by ID using Mongoose
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Basic input validation
    if (!LN || !phrchaseAmount || !selectType || !select) {
      logger.error("error: Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Additional validation if needed
    if (phrchaseAmount <= 0) {
      logger.error(" error =>Purchase amount must be greater than zero ");
      return res
        .status(400)
        .json({ error: "Purchase amount must be greater than zero" });
    }

    // deduct balance in wallet

    if (user.wallet >= phrchaseAmount) {
      // const balanceDeduct = await User.findByIdAndUpdate(userId,{ $inc: { wallet: - phrchaseAmount} });
      // Calculate tax
      const tax = 0.02 * phrchaseAmount;
      const amountAfterTax = phrchaseAmount - tax;

      // Create a unique order ID (you may use a library like uuid)
      const orderId = generateUniqueOrderId();
console.log({orderId})
      let user_level = 0;
      const { level, levels } = user.user_level;

      if (levels && levels[level]) {
        const { rebate_rate } = levels[level];
        const newRebateAmount = (rebate_rate * phrchaseAmount) / 100;

        // Save the updated user document to the database
        // For demonstration purposes, we'll just log the updated user object
        console.log("Updated User:", newRebateAmount);
        user_level = newRebateAmount;
      }

      // Create a new bet instance
      await User.updateOne(
        { _id: userId },
        {
          $inc: {
            "user_level.total_bet_amount": phrchaseAmount,
            "user_level.rebate_amount": user_level,
            "user_level.exp": phrchaseAmount,
            wallet: -phrchaseAmount,
            rangeToWithdraw:
              phrchaseAmount <= user.rangeToWithdraw ? -phrchaseAmount : 0,
          },
        }
      );

      const newBet = new thirty_sec_user_bet({
        LN,
        userId,
        orderNumber: orderId,
        phrchaseAmount,
        amountAfterTax,
        tax,
        selectType,
        select,
      });

      // Save the bet to the database
      await newBet.save();
      if (user.referalUserCode) {
        let upcomingUser = user.referalUserCode;
        let commision_rate = 0;

        while (upcomingUser) {
          const referringUser = await User.findOne({
            inviteCode: upcomingUser,
          });
          if (!referringUser) {
            upcomingUser = null;
            break;
          }

          if (referringUser.level == 0) {
            commision_rate = 0;
          }
          if (referringUser.level == 1) {
            commision_rate = 0.07;
          }
          if (referringUser.level == 2) {
            commision_rate = 0.08;
          }
          if (referringUser.level == 3) {
            commision_rate = 0.09;
          }
          if (referringUser.level == 4) {
            commision_rate = 0.095;
          }
          if (referringUser.level == 5) {
            commision_rate = 0.1;
          }
          // let commision_amount = commision_rate * phrchaseAmount;
          let commision_amount = (phrchaseAmount * commision_rate) / 100;

          // console.log(commision_amount);
          await commission.updateOne(
            { userId: referringUser._id },
            {
              $push: {
                results: {
                  amount: commision_amount,
                  type: "bet",
                  date: Date.now(),
                  rate: commision_rate,
                },
              },
              $inc: {
                total_commission: commision_amount,
                bet_commission: commision_amount,
              },
            }
          );

          if (referringUser.referalUserCode) {
            upcomingUser = referringUser.referalUserCode;
          } else {
            upcomingUser = null;
          }
        }
      }

      return res
        .status(201)
        .json({ message: "Bet placed successfully", orderId });
    }
    return res.status(404).json({ error: "insufficient amount" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const OneMinBets = async (req, res) => {
  try {
    const { LN, phrchaseAmount, selectType, select } = req.body;
    const userId = req.userId;

    // Find the user by ID using Mongoose
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Basic input validation
    if (!LN || !phrchaseAmount || !selectType || !select) {
      logger.error("error: Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Additional validation if needed
    if (phrchaseAmount <= 0) {
      logger.error(" error =>Purchase amount must be greater than zero ");
      return res
        .status(400)
        .json({ error: "Purchase amount must be greater than zero" });
    }

    if (user.wallet >= phrchaseAmount) {
      // Calculate tax
      const tax = 0.02 * phrchaseAmount;
      const amountAfterTax = phrchaseAmount - tax;

      // Create a unique order ID (you may use a library like uuid)
      const orderId = generateUniqueOrderId();

      let user_level = 0;
      const { level, levels } = user.user_level;

      if (levels && levels[level]) {
        const { rebate_rate } = levels[level];
        const newRebateAmount = (rebate_rate * phrchaseAmount) / 100;

        // Save the updated user document to the database
        // For demonstration purposes, we'll just log the updated user object
        console.log("Updated User:", newRebateAmount);
        user_level = newRebateAmount;
      }

      await User.updateOne(
        { _id: userId },
        {
          $inc: {
            "user_level.total_bet_amount": phrchaseAmount,
            "user_level.rebate_amount": user_level,
            "user_level.exp": phrchaseAmount,
            wallet: -phrchaseAmount,
            rangeToWithdraw:
              phrchaseAmount <= user.rangeToWithdraw ? -phrchaseAmount : 0,
          },
        }
      );
      // Create a new bet instance
      const newBet = new one_min_user_bet({
        LN,
        userId,
        orderNumber: orderId,
        phrchaseAmount,
        amountAfterTax,
        tax,
        selectType,
        select,
      });

      // Save the bet to the database
      await newBet.save();

      if (user.referalUserCode) {
        let upcomingUser = user.referalUserCode;
        let commision_rate = 0;

        while (upcomingUser) {
          const referringUser = await User.findOne({
            inviteCode: upcomingUser,
          });
          if (!referringUser) {
            upcomingUser = null;
            break;
          }

          if (referringUser.level == 0) {
            commision_rate = 0;
          }
          if (referringUser.level == 1) {
            commision_rate = 0.07;
          }
          if (referringUser.level == 2) {
            commision_rate = 0.08;
          }
          if (referringUser.level == 3) {
            commision_rate = 0.09;
          }
          if (referringUser.level == 4) {
            commision_rate = 0.095;
          }
          if (referringUser.level == 5) {
            commision_rate = 0.1;
          }
          // let commision_amount = commision_rate * phrchaseAmount;
          let commision_amount = (phrchaseAmount * commision_rate) / 100;

          // console.log(commision_amount);
          await commission.updateOne(
            { userId: referringUser._id },
            {
              $push: {
                results: {
                  amount: commision_amount,
                  type: "bet",
                  date: Date.now(),
                  rate: commision_rate,
                },
              },
              $inc: {
                total_commission: commision_amount,
              },
            }
          );

          if (referringUser.referalUserCode) {
            upcomingUser = referringUser.referalUserCode;
          } else {
            upcomingUser = null;
          }
        }
      }

      return res
        .status(201)
        .json({ message: "Bet placed successfully", orderId });
    }
    return res.status(404).json({ error: "insufficient amount" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const ThreeMinBets = async (req, res) => {
  try {
    const { LN, phrchaseAmount, selectType, select } = req.body;
    const userId = req.userId;

    // Find the user by ID using Mongoose
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Basic input validation
    if (!LN || !phrchaseAmount || !selectType || !select) {
      logger.error("error: Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Additional validation if needed
    if (phrchaseAmount <= 0) {
      logger.error(" error =>Purchase amount must be greater than zero ");
      return res
        .status(400)
        .json({ error: "Purchase amount must be greater than zero" });
    }
    if (user.wallet >= phrchaseAmount) {
      // Calculate tax
      const tax = 0.02 * phrchaseAmount;
      const amountAfterTax = phrchaseAmount - tax;

      // Create a unique order ID (you may use a library like uuid)
      const orderId = generateUniqueOrderId();

      let user_level = 0;
      const { level, levels } = user.user_level;

      if (levels && levels[level]) {
        const { rebate_rate } = levels[level];
        const newRebateAmount = (rebate_rate * phrchaseAmount) / 100;

        // Save the updated user document to the database
        // For demonstration purposes, we'll just log the updated user object
        console.log("Updated User:", newRebateAmount);
        user_level = newRebateAmount;
      }

      await User.updateOne(
        { _id: userId },
        {
          $inc: {
            "user_level.total_bet_amount": phrchaseAmount,
            "user_level.rebate_amount": user_level,
            "user_level.exp": phrchaseAmount,
            wallet: -phrchaseAmount,
            rangeToWithdraw:
              phrchaseAmount <= user.rangeToWithdraw ? -phrchaseAmount : 0,
          },
        }
      );

      const newBet = new three_min_user_bet({
        LN,
        userId,
        orderNumber: orderId,
        phrchaseAmount,
        amountAfterTax,
        tax,
        selectType,
        select,
      });

      // Save the bet to the database
      await newBet.save();

      if (user.referalUserCode) {
        let upcomingUser = user.referalUserCode;
        let commision_rate = 0;
        while (upcomingUser) {
          const referringUser = await User.findOne({
            inviteCode: upcomingUser,
          });
          if (!referringUser) {
            upcomingUser = null;
            break;
          }

          if (referringUser.level == 0) {
            commision_rate = 0;
          }
          if (referringUser.level == 1) {
            commision_rate = 0.07;
          }
          if (referringUser.level == 2) {
            commision_rate = 0.08;
          }
          if (referringUser.level == 3) {
            commision_rate = 0.09;
          }
          if (referringUser.level == 4) {
            commision_rate = 0.095;
          }
          if (referringUser.level == 5) {
            commision_rate = 0.1;
          }
          // let commision_amount = commision_rate * phrchaseAmount;
          let commision_amount = (phrchaseAmount * commision_rate) / 100;

          await commission.updateOne(
            { userId: referringUser._id },
            {
              $push: {
                results: {
                  amount: commision_amount,
                  type: "bet",
                  date: Date.now(),
                  rate: commision_rate,
                },
              },
              $inc: {
                total_commission: commision_amount,
              },
            }
          );

          if (referringUser.referalUserCode) {
            upcomingUser = referringUser.referalUserCode;
          } else {
            upcomingUser = null;
          }
        }
      }
      // Create a new bet instance

      return res
        .status(201)
        .json({ message: "Bet placed successfully", orderId });
    }
    return res.status(404).json({ error: "insufficient amount" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const FiveMinBets = async (req, res) => {
  try {
    const { LN, phrchaseAmount, selectType, select } = req.body;
    const userId = req.userId;

    // Find the user by ID using Mongoose
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Basic input validation
    if (!LN || !phrchaseAmount || !selectType || !select) {
      logger.error("error: Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Additional validation if needed
    if (phrchaseAmount <= 0) {
      logger.error(" error =>Purchase amount must be greater than zero ");
      return res
        .status(400)
        .json({ error: "Purchase amount must be greater than zero" });
    }
    if (user.wallet >= phrchaseAmount) {
      // Calculate tax
      const tax = 0.02 * phrchaseAmount;
      const amountAfterTax = phrchaseAmount - tax;

      // Create a unique order ID (you may use a library like uuid)
      const orderId = generateUniqueOrderId();

      // Create a new bet instance
      const newBet = new five_min_user_bet({
        LN,
        userId,
        orderNumber: orderId,
        phrchaseAmount,
        amountAfterTax,
        tax,
        selectType,
        select,
      });

      // Save the bet to the database
      await newBet.save();

      let user_level = 0;
      const { level, levels } = user.user_level;

      if (levels && levels[level]) {
        const { rebate_rate } = levels[level];
        const newRebateAmount = rebate_rate * phrchaseAmount;

        // Save the updated user document to the database
        // For demonstration purposes, we'll just log the updated user object
        console.log("Updated User:", newRebateAmount);
        user_level = newRebateAmount;
      }

      await User.updateOne(
        { _id: userId },
        {
          $inc: {
            "user_level.total_bet_amount": phrchaseAmount,
            "user_level.rebate_amount": user_level,
            "user_level.exp": phrchaseAmount,
            wallet: -phrchaseAmount,
            rangeToWithdraw:
              phrchaseAmount <= user.rangeToWithdraw ? -phrchaseAmount : 0,
          },
        }
      );

      if (user.referalUserCode) {
        let upcomingUser = user.referalUserCode;
        let commision_rate = 0;

        while (upcomingUser) {
          const referringUser = await User.findOne({
            inviteCode: upcomingUser,
          });
          if (!referringUser) {
            upcomingUser = null;
            break;
          }

          if (referringUser.level == 0) {
            commision_rate = 0;
          }
          if (referringUser.level == 1) {
            commision_rate = 0.07;
          }
          if (referringUser.level == 2) {
            commision_rate = 0.08;
          }
          if (referringUser.level == 3) {
            commision_rate = 0.09;
          }
          if (referringUser.level == 4) {
            commision_rate = 0.095;
          }
          if (referringUser.level == 5) {
            commision_rate = 0.1;
          }
          // let commision_amount = commision_rate * phrchaseAmount;
          let commision_amount = (phrchaseAmount * commision_rate) / 100;

          // console.log(commision_amount);
          await commission.updateOne(
            { userId: referringUser._id },
            {
              $push: {
                results: {
                  amount: commision_amount,
                  type: "bet",
                  date: Date.now(),
                  rate: commision_rate,
                },
              },
              $inc: {
                total_commission: commision_amount,
              },
            }
          );

          if (referringUser.referalUserCode) {
            upcomingUser = referringUser.referalUserCode;
          } else {
            upcomingUser = null;
          }
        }
      }

      return res
        .status(201)
        .json({ message: "Bet placed successfully", orderId });
    }

    return res.status(404).json({ error: "insufficient amount" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getThirtySecBets = async (req, res) => {
  try {
    const userId = req.userId;

    // Find the user by ID using Mongoose
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const thirtyBetOfUser = await thirty_sec_user_bet
      .find({ userId: userId })
      .sort({ orderTime: -1 });

    res
      .status(201)
      .json({ message: "30 Second data fetch successfully", thirtyBetOfUser });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOneMinBets = async (req, res) => {
  try {
    const userId = req.userId;

    // Find the user by ID using Mongoose
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const oneBetOfUser = await one_min_user_bet
      .find({ userId: userId })
      .sort({ orderTime: -1 });
    res
      .status(201)
      .json({ message: "30 Second data fetch successfully", oneBetOfUser });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getThreeMinBets = async (req, res) => {
  try {
    const userId = req.userId;

    // Find the user by ID using Mongoose
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const threeBetOfUser = await three_min_user_bet
      .find({ userId: userId })
      .sort({ orderTime: -1 });
    res
      .status(201)
      .json({ message: "30 Second data fetch successfully", threeBetOfUser });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFiveMinBets = async (req, res) => {
  try {
    const userId = req.userId;

    // Find the user by ID using Mongoose
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const fiveBetOfUser = await five_min_user_bet
      .find({ userId: userId })
      .sort({ orderTime: -1 });
    res
      .status(201)
      .json({ message: "30 Second data fetch successfully", fiveBetOfUser });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  ThirtySecBets,
  OneMinBets,
  ThreeMinBets,
  FiveMinBets,
  getThirtySecBets,
  getOneMinBets,
  getThreeMinBets,
  getFiveMinBets,
};
