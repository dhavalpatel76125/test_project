const logger = require("../Services/logger");
const { generateLotteryResult } = require("../utility/LottaryController");
const Lottery30Sec = require("../Models/30SecLottary");
const Lottery1Min = require("../Models/1MinLottary");
const Lottery3Min = require("../Models/3MinLottary");
const Lottery5Min = require("../Models/5MinLottary");

const thirty_sec_user_bet = require("../Models/30sec_place_bet");
const one_min_user_bet = require("../Models/1min_place_bet");
const three_min_user_bet = require("../Models/3min_place_bet");
const five_min_user_bet = require("../Models/5min_place_bet");

const User = require("../Models/User");
const log = require('../utility/logStyle')

const thirtySecLottery = async (req, res) => {
  try {
    const latestLotteryEntry = await Lottery30Sec.findOne().sort({ LN: -1 });

    let latestNumber = 1;
    if (latestLotteryEntry) {
      latestNumber = latestLotteryEntry.LN + 1;
    }

    const result = generateLotteryResult();

    const newLotteryEntry = {
      LN: latestNumber,
      color: result.color,
      number: result.number,
      size: result.size,
    };

    const thirtySecondBet = await thirty_sec_user_bet
      .find({ LN: latestNumber })
      .exec();

    if (thirtySecLottery.length !== 0) {
      for (let i = 0; i < thirtySecondBet.length; i++) {
        // Initialize phrchaseAmount variable

        if (
          thirtySecondBet[i].selectType === "number" &&
          Number(thirtySecondBet[i].select) === newLotteryEntry.number
        ) {
          phrchaseAmount = thirtySecondBet[i].amountAfterTax * 9;
          await User.updateOne(
            { _id: thirtySecondBet[i].userId },
            { $inc: { wallet: phrchaseAmount } }
          );
          await thirty_sec_user_bet.updateOne(
            { _id: thirtySecondBet[i]._id },
            { result: newLotteryEntry, status: "success",win_loss:String(+phrchaseAmount) }
          );
        } else if (
          thirtySecondBet[i].selectType === "size" &&
          thirtySecondBet[i].select === newLotteryEntry.size
        ) {
          phrchaseAmount = thirtySecondBet[i].amountAfterTax * 2;
          await User.updateOne(
            { _id: thirtySecondBet[i].userId },
            { $inc: { wallet: phrchaseAmount } }
          );
          await thirty_sec_user_bet.updateOne(
            { _id: thirtySecondBet[i]._id },
            { result: newLotteryEntry, status: "success",win_loss:String(+phrchaseAmount)}
          );
        } else if (
          thirtySecondBet[i].selectType === "color" &&
          newLotteryEntry.color.includes(thirtySecondBet[i].select)
        ) {
          let phrchaseAmount = 0;
          if (newLotteryEntry.color.length === 2) {
            phrchaseAmount = thirtySecondBet[i].amountAfterTax * 1.5;
          } else {
            phrchaseAmount = thirtySecondBet[i].amountAfterTax * 2;
          }
          const updatuserifelse = await User.updateOne(
            { _id: thirtySecondBet[i].userId },
            { $inc: { wallet: phrchaseAmount } }
          );

          const updateifelse = await thirty_sec_user_bet.updateOne(
            { _id: thirtySecondBet[i]._id },
            { result: newLotteryEntry, status: "success",win_loss:String(+(phrchaseAmount)) }
          );
        } else {
          const updateelse = await thirty_sec_user_bet.updateOne(
            { _id: thirtySecondBet[i]._id },
            { result: newLotteryEntry, status: "failed",win_loss:String(-thirtySecondBet[i].amountAfterTax) }
          );
        }
      }
    }

    const savedLotteryEntry = await Lottery30Sec.create(newLotteryEntry);
    if (savedLotteryEntry) {
      logger.info(
        `Lottery Result create For 30 Second of Lottery Number ${newLotteryEntry.LN}`
      );
    }
  } catch (err) {
    logger.error(err.message);
  }
};

const oneMinLottery = async (req, res) => {
  try {
    const latestLotteryEntry = await Lottery1Min.findOne().sort({ LN: -1 });

    let latestNumber = 1;
    if (latestLotteryEntry) {
      latestNumber = latestLotteryEntry.LN + 1;
    }

    const result = generateLotteryResult();

    const newLotteryEntry = {
      LN: latestNumber,
      color: result.color,
      number: result.number,
      size: result.size,
    };

    const oneMinBet = await one_min_user_bet
      .find({ LN: latestNumber })
      .populate("userId")
      .exec();

    if (oneMinBet.length !== 0) {
      for (let i = 0; i < oneMinBet.length; i++) {
        // Initialize phrchaseAmount variable

        if (
          oneMinBet[i].selectType === "number" &&
          Number(oneMinBet[i].select) === newLotteryEntry.number
        ) {
          phrchaseAmount = oneMinBet[i].amountAfterTax * 9;
          await User.updateOne(
            { _id: oneMinBet[i].userId },
            { $inc: { wallet: phrchaseAmount } }
          );
          await one_min_user_bet.updateOne(
            { _id: oneMinBet[i]._id },
            { result: newLotteryEntry, status: "success",win_loss:String(phrchaseAmount) }
          );
        } else if (
          oneMinBet[i].selectType === "size" &&
          oneMinBet[i].select === newLotteryEntry.size
        ) {
          phrchaseAmount = oneMinBet[i].amountAfterTax * 2;
          await User.updateOne(
            { _id: oneMinBet[i].userId },
            { $inc: { wallet: phrchaseAmount } }
          );
          await one_min_user_bet.updateOne(
            { _id: oneMinBet[i]._id },
            { result: newLotteryEntry, status: "success",win_loss:String(phrchaseAmount) }
          );
        } else if (
          oneMinBet[i].selectType === "color" &&
          newLotteryEntry.color.includes(oneMinBet[i].select)
        ) {
          let phrchaseAmount = 0;
          if (newLotteryEntry.color.length === 2) {
            phrchaseAmount = oneMinBet[i].amountAfterTax * 1.5;
          } else {
            phrchaseAmount = oneMinBet[i].amountAfterTax * 2;
          }
          const updatuserifelse = await User.updateOne(
            { _id: oneMinBet[i].userId },
            { $inc: { wallet: phrchaseAmount } }
          );

          const updateifelse = await one_min_user_bet.updateOne(
            { _id: oneMinBet[i]._id },
            { result: newLotteryEntry, status: "success",win_loss:String(phrchaseAmount) }
          );
        } else {
          const updateelse = await one_min_user_bet.updateOne(
            { _id: oneMinBet[i]._id },
            { result: newLotteryEntry, status: "failed" ,win_loss:String(-thirtySecondBet[i].amountAfterTax)}
          );
        }
      }
    }

    const savedLotteryEntry = await Lottery1Min.create(newLotteryEntry);
    if (savedLotteryEntry) {
      logger.info(
        `Lottery Result create For 1 Minutes of Lottery Number ${newLotteryEntry.LN}`
      );
    }
    // res.status(201).json(savedLotteryEntry); // 201 Created
  } catch (err) {
    logger.error(err.message);
  }
};

const threeMinLottery = async (req, res) => {
  try {
    const latestLotteryEntry = await Lottery3Min.findOne().sort({ LN: -1 });
    let latestNumber = 1;
    if (latestLotteryEntry) {
      latestNumber = latestLotteryEntry.LN + 1;
    }
    const result = generateLotteryResult();

    const newLotteryEntry = {
      LN: latestNumber,
      color: result.color,
      number: result.number,
      size: result.size,
    };

    const threeMinBet = await three_min_user_bet
      .find({ LN: latestNumber })
      .populate("userId")
      .exec();

    if (threeMinBet.length !== 0) {
      for (let i = 0; i < threeMinBet.length; i++) {
        // Initialize phrchaseAmount variable

        if (
          threeMinBet[i].selectType === "number" &&
          Number(threeMinBet[i].select) === newLotteryEntry.number
        ) {
          phrchaseAmount = threeMinBet[i].amountAfterTax * 9;
          await User.updateOne(
            { _id: threeMinBet[i].userId },
            { $inc: { wallet: phrchaseAmount } }
          );
          await three_min_user_bet.updateOne(
            { _id: threeMinBet[i]._id },
            { result: newLotteryEntry, status: "success" ,win_loss:String(phrchaseAmount)}
          );
        } else if (
          threeMinBet[i].selectType === "size" &&
          threeMinBet[i].select === newLotteryEntry.size
        ) {
          phrchaseAmount = threeMinBet[i].amountAfterTax * 2;
          await User.updateOne(
            { _id: threeMinBet[i].userId },
            { $inc: { wallet: phrchaseAmount } }
          );
          await three_min_user_bet.updateOne(
            { _id: threeMinBet[i]._id },
            { result: newLotteryEntry, status: "success" ,win_loss:String(phrchaseAmount)}
          );
        } else if (
          threeMinBet[i].selectType === "color" &&
          newLotteryEntry.color.includes(threeMinBet[i].select)
        ) {
          let phrchaseAmount = 0;
          if (newLotteryEntry.color.length === 2) {
            phrchaseAmount = threeMinBet[i].amountAfterTax * 1.5;
          } else {
            phrchaseAmount = threeMinBet[i].amountAfterTax * 2;
          }
          const updatuserifelse = await User.updateOne(
            { _id: threeMinBet[i].userId },
            { $inc: { wallet: phrchaseAmount } }
          );

          const updateifelse = await three_min_user_bet.updateOne(
            { _id: threeMinBet[i]._id },
            { result: newLotteryEntry, status: "success",win_loss:String(phrchaseAmount) }
          );
        } else {
          const updateelse = await three_min_user_bet.updateOne(
            { _id: threeMinBet[i]._id },
            { result: newLotteryEntry, status: "failed",win_loss:String(-thirtySecondBet[i].amountAfterTax) }
          );
        }
      }
    }

    const savedLotteryEntry = await Lottery3Min.create(newLotteryEntry);

    if (savedLotteryEntry) {
      logger.info(
        `Lottery Result create For 3 Minutes of Lottery Number ${newLotteryEntry.LN}`
      );
    }
  } catch (err) {
    logger.error(err.message);
  }
};

const fiveMinLottery = async (req, res) => {
  try {
    const latestLotteryEntry = await Lottery5Min.findOne().sort({ LN: -1 });
    let latestNumber = 1;
    if (latestLotteryEntry) {
      latestNumber = latestLotteryEntry.LN + 1;
    }
    const result = generateLotteryResult();
    const newLotteryEntry = {
      LN: latestNumber,
      color: result.color,
      number: result.number,
      size: result.size,
    };

    const fiveMinBet = await five_min_user_bet
      .find({ LN: latestNumber })
      .populate("userId")
      .exec();

    if (fiveMinBet.length !== 0) {
      for (let i = 0; i < fiveMinBet.length; i++) {
        // Initialize phrchaseAmount variable

        if (
          fiveMinBet[i].selectType === "number" &&
          Number(fiveMinBet[i].select) === newLotteryEntry.number
        ) {
          phrchaseAmount = fiveMinBet[i].amountAfterTax * 9;
          await User.updateOne(
            { _id: fiveMinBet[i].userId },
            { $inc: { wallet: phrchaseAmount } }
          );
          await five_min_user_bet.updateOne(
            { _id: fiveMinBet[i]._id },
            { result: newLotteryEntry, status: "success" ,win_loss:String(phrchaseAmount)}
          );
        } else if (
          fiveMinBet[i].selectType === "size" &&
          fiveMinBet[i].select === newLotteryEntry.size
        ) {
          phrchaseAmount = fiveMinBet[i].amountAfterTax * 2;
          await User.updateOne(
            { _id: fiveMinBet[i].userId },
            { $inc: { wallet: phrchaseAmount } }
          );
          await five_min_user_bet.updateOne(
            { _id: fiveMinBet[i]._id },
            { result: newLotteryEntry, status: "success",win_loss:String(phrchaseAmount) }
          );
        } else if (
          fiveMinBet[i].selectType === "color" &&
          newLotteryEntry.color.includes(fiveMinBet[i].select)
        ) {
          let phrchaseAmount = 0;
          if (newLotteryEntry.color.length === 2) {
            phrchaseAmount = fiveMinBet[i].amountAfterTax * 1.5;
          } else {
            phrchaseAmount = fiveMinBet[i].amountAfterTax * 2;
          }
          const updatuserifelse = await User.updateOne(
            { _id: fiveMinBet[i].userId },
            { $inc: { wallet: phrchaseAmount } }
          );

          const updateifelse = await five_min_user_bet.updateOne(
            { _id: fiveMinBet[i]._id },
            { result: newLotteryEntry, status: "success",win_loss:String(phrchaseAmount) }
          );
        } else {
          const updateelse = await five_min_user_bet.updateOne(
            { _id: fiveMinBet[i]._id },
            { result: newLotteryEntry, status: "failed" ,win_loss:String(-thirtySecondBet[i].amountAfterTax)}
          );
        }
      }
    }

    const savedLotteryEntry = await Lottery5Min.create(newLotteryEntry);

    if (savedLotteryEntry) {
      logger.info(
        `Lottery Result create For 5 Minutes of Lottery Number ${newLotteryEntry.LN}`
      );
    }
  } catch (err) {
    logger.error(err.message);
  }
};

// Fetch all the Random Lottery Results in Array

const getAll30SecLottery = async (req, res) => {
  try {
    // Retrieve all lottery entries from the database
    const allLotteryEntries = await Lottery30Sec.find().sort({LN:-1});

    res.status(200).json({ success: true, data: allLotteryEntries });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAll1minLottery = async (req, res) => {
  try {
    // Retrieve all lottery entries from the database
    const allLotteryEntries = await Lottery1Min.find().sort({LN:-1});

    res.json({ success: true, data: allLotteryEntries });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAll3MinLottery = async (req, res) => {
  try {
    // Retrieve all lottery entries from the database
    const allLotteryEntries = await Lottery3Min.find().sort({LN:-1});

    res.json({ success: true, data: allLotteryEntries });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAll5MinLottery = async (req, res) => {
  try {
    // Retrieve all lottery entries from the database
    const allLotteryEntries = await Lottery5Min.find().sort({LN:-1});

    res.json({ success: true, data: allLotteryEntries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" })
  }
};

const getlatest30SecLottery = async (req, res) => {
  try {
    // Retrieve all lottery entries from the database
    const latestLotteryEntry = await Lottery30Sec.findOne().sort({ LN: -1 });

    res.status(200).json({ success: true, data: latestLotteryEntry });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getlatest1minLottery = async (req, res) => {
  try {
    // Retrieve all lottery entries from the database
    const allLotteryEntries = await Lottery1Min.findOne().sort({LN:-1});

    res.json({ success: true, data: allLotteryEntries });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getlatest3MinLottery = async (req, res) => {
  try {
    // Retrieve all lottery entries from the database
    const allLotteryEntries = await Lottery3Min.findOne().sort({LN:-1});

    res.json({ success: true, data: allLotteryEntries });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getlatest5MinLottery = async (req, res) => {
  try {
    // Retrieve all lottery entries from the database
    const allLotteryEntries = await Lottery5Min.findOne().sort({LN:-1});

    res.json({ success: true, data: allLotteryEntries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" })
  }
};
// get by lottary number
const lotteryNumber = async (req, res) => {
  try {
    const lotteryNumber = req.params.number;

    // Validate the lottery number format (you may need additional validation)
    if (isNaN(lotteryNumber) || lotteryNumber <= 0) {
      return res.status(400).json({ error: "Invalid lottery number" });
    }

    // Retrieve the lottery entry by number from the database
    const lotteryEntry = await Lottery30Sec.findOne({ number: lotteryNumber });

    if (!lotteryEntry) {
      return res.status(404).json({ error: "Lottery entry not found" });
    }

    res.json({ success: true, data: lotteryEntry });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const lottery1minByNumber = async (req, res) => {
  try {
    const lotteryNumber = req.params.number;

    // Validate the lottery number format (you may need additional validation)
    if (isNaN(lotteryNumber) || lotteryNumber <= 0) {
      return res.status(400).json({ error: "Invalid lottery number" });
    }

    // Retrieve the lottery entry by number from the database
    const lotteryEntry = await Lottery1Min.findOne({ number: lotteryNumber });

    if (!lotteryEntry) {
      return res.status(404).json({ error: "Lottery entry not found" });
    }

    res.json({ success: true, data: lotteryEntry });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const lottery3minByNumber = async (req, res) => {
  try {
    const lotteryNumber = req.params.number;

    // Validate the lottery number format (you may need additional validation)
    if (isNaN(lotteryNumber) || lotteryNumber <= 0) {
      return res.status(400).json({ error: "Invalid lottery number" });
    }

    // Retrieve the lottery entry by number from the database
    const lotteryEntry = await Lottery3Min.findOne({ number: lotteryNumber });

    if (!lotteryEntry) {
      return res.status(404).json({ error: "Lottery entry not found" });
    }

    res.json({ success: true, data: lotteryEntry });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  thirtySecLottery,
  oneMinLottery,
  threeMinLottery,
  fiveMinLottery,
  getAll30SecLottery,
  lotteryNumber,
  getAll1minLottery,
  lottery1minByNumber,
  getAll3MinLottery,
  lottery3minByNumber,
  getAll5MinLottery,
  getlatest30SecLottery,
  getlatest1minLottery,
  getlatest3MinLottery,
  getlatest5MinLottery,
};
