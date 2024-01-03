// here we need to deposite amount of rebate to account of user when hit so this is amount created to user wallet and then deposite document is created

const User = require("../Models/User");
const Deposit = require("../Models/deposite"); // You'll need to have a Deposit model defined
const generateTransactionId = require("../utility/trasactionId");
const generateUniqueOrderId = require("../utility/randamOrderId");
const log = require('../utility/logStyle')

const depositRebateToUser = async (req, res) => {
  try {
    // Find the user by userId
    const userId = req.userId;

    // Find the user by ID using Mongoose
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Update the user's wallet with the rebate amount
    console.log(user);
    const { rebate_amount } = user.user_level;
    console.log(rebate_amount);
    if (!rebate_amount && rebate_amount == 0) {
      return res.status(404).json({ error: "insufficient rebeate amount" });
    }
    // Save the updated user
    await User.updateOne(
      { _id: userId },
      {
        "user_level.rebate_amount": 0,
        $inc: {
          wallet: rebate_amount,
          // rangeToWithdraw:rebate_amount
        },
      }
    );

    const orderId = generateUniqueOrderId();

    const deposit = new Deposit({
      userId: userId,
      orderNumber: orderId,
      amount: rebate_amount,
      transactionId: generateTransactionId(),
      type: "rebate", // 'rebate' in this case
      status: "completed", // Assuming that a rebate is immediately completed
      // depositCount: 1, // Increase depositCount when deposit status is success
      // recentDepositeAmount: rebateAmount, // Add the deposit amount when added to the account
    });

    await deposit.save();
    return res
      .status(200)
      .json({ message: "successful deposit rebeat to wallet" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { depositRebateToUser };
