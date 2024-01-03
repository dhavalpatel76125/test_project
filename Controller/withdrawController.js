const logger = require("../Services/logger");
const Withdraw = require("../Models/withdraw");
const generateUniqueOrderId = require("../utility/randamOrderId");
const User = require("../Models/User");
const generateTransactionId = require("../utility/trasactionId");


const withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.userId;

    // Find the user by ID using Mongoose
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Validate the input parameters
    if (!amount ) {
      return res.status(404).json({ error: "amount not found" });
    }
    if (amount<100) {
      return res.status(404).json({ error: "not valid amount" });
    }
    const orderNumber = generateUniqueOrderId();

    if(user.wallet <amount){
      return res.status(404).json({ error: "insufficent amount" });
    }

    // write a code to dedect amount from user wallet and check the limit of deposit and send mail to user email
    //    add a payment gateway to send amount or anything else
    await User.updateOne(
      { _id: user._id },
      { $inc: { wallet: -amount } }
    );
    // Create a new withdrawal instance
    const newWithdrawal = new Withdraw({
      userId,
      orderNumber: orderNumber,
      amount,
      transactionId: generateTransactionId(),
      status: "pending", // Set the initial status to pending
    });

    // Save the withdrawal to the database
    const savedWithdrawal = await Withdraw.create(newWithdrawal);

    return res.status(200).json({ message: "create withdrawal of amount"});
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ error: "Failed to create withdrawalerror.message"});
  }
};

// genrate order no
const getWithdraw = async (req, res) => {
  try {
    const { userId, orderNumber, status, ordernumberGateway, transactionId } =
      req.body;
    // Validate the input parameters
    if (
      !userId ||
      !orderNumber ||
      !status ||
      !ordernumberGateway ||
      !transactionId ||
      !successTime
    ) {
      throw new Error("Order number and status are required");
    }

    // Find the withdrawal by order number and update the status
    const updatedWithdrawal = await Withdraw.findOneAndUpdate(
      { userId },
      {
        status: status,
        orderNumber: orderNumber,
        ordernumberGateway: ordernumberGateway,
        transactionId: transactionId,
      },
      { new: true }
    );

    return updatedWithdrawal;
  } catch (err) {
    logger.error(err.message);
  }
};

const getWithdrawByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate the user ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Retrieve withdrawals by user ID from the database
    const userWithdrawals = await Withdraw.find({ userId });

    res.json({ success: true, data: userWithdrawals });
  } catch (err) {
    logger.error(err.message);
  }
};

module.exports = { withdraw, getWithdraw, getWithdrawByUser };
