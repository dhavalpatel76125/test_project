// commision amount will process every 24 hours

const cron = require("node-cron");
const Commission = require("../Models/commission");
const Deposit = require("../Models/deposite");
const User = require("../Models/User");
const generateTransactionId = require("../utility/trasactionId");
const generateUniqueOrderId = require("../utility/randamOrderId");
const logger = require("../Services/logger");

const processCommissionCron = cron.schedule("0 0 * * *", async () => {
  try {
    // Fetch all commissions
    logger.info('Running Process Commission Cron...');
    const allCommissions = await Commission.find({});

    // Process each commission
    for (const commission of allCommissions) {
      // Calculate the total commission to be added to the user's wallet
      const totalCommission = commission.total_commission;

      if (totalCommission > 0) {
        // Create a deposit document
        await User.updateOne(
          { _id: commission.userId },
          {
            $inc: {
              wallet: Math.ceil(commission.total_commission),
              rangeToWithdraw:
                totalCommission.bet_commission > 0
                  ? totalCommission.bet_commission
                  : 0,
            },
          }
        );
        const orderId = generateUniqueOrderId();

        const deposit = new Deposit({
          userId: commission.userId,
          orderNumber: orderId,
          amount: Math.ceil(commission.total_commission),
          transactionId: generateTransactionId(),
          type: "commission", // 'commission' in this case
          status: "completed", // Assuming that a rebate is immediately completed
          // depositCount: 1, // Increase depositCount when deposit status is success
          // recentDepositeAmount: rebateAmount, // Add the deposit amount when added to the account
        });

        await deposit.save();

        console.log(deposit);
        // Reset the total commission to 0 after processing
        await Commission.updateOne(
          { userId: commission.userId },
          {
            
              total_commission: 0,
              deposit_commission: 0,
              bet_commission: 0,
            
            $inc: {
              withdraw_amount: commission.total_commission,
            },
            $push: {
                withdraw_history: {
                    orderId: orderId,
                    amount: Math.ceil(commission.total_commission),
                    transactionId: generateTransactionId(),
                    status: "completed",
                }
            },
          }
        );

        logger.info(
          `Commission of ${totalCommission} credited to user ${commission.userId}`
        );
      }
    }
    console.log("\x1b[1m\x1b[32m\x1b[3m%s\x1b[0m",`Process Commission Money Cron completed.`);
    logger.info("processCommissionCron completed.");
  } catch (error) {
    logger.error("Error in processCommissionCron:", error);
  }
});

module.exports = processCommissionCron;
