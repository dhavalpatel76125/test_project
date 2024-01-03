const nodemailer = require("nodemailer");
const sendEmail = require("../Services/Mailer");

// Registration Notification
const registrationSubject = "Welcome to BetNinja!";
const registrationBody = (username) => `
  Dear ${username},

  Welcome to BetNinja! You have successfully registered with us.

  Thank you for choosing BetNinja as your gaming platform.

  Tips and Tricks:
  - Join our daily lotteries for a chance to win big prizes.
  - Refer friends to increase your chances and earn bonuses.

  धन्यवाद,
  BetNinja टीम
`;

const loginSubject = "BetNinja Login Notification";
const loginBody = (username) => `
  Dear ${username},

  You have logged in to your BetNinja account at ${new Date()}.

  If this was not you, please contact support immediately.

  Best regards,
  BetNinja Team
`;

const withdrawalRequestSubject = "Withdrawal Request Received";
const withdrawalRequestBody = (username) => `
  Dear ${username},

  Your withdrawal request has been received. We will process it shortly.

  Tips: Participate in lotteries to increase your winnings.

  Thank you for using BetNinja.

  Best regards,
  BetNinja Team
`;

const withdrawalCompleteSubject = "Withdrawal Processed Successfully";
const withdrawalCompleteBody = (username) => `
  Dear ${username},

  Your withdrawal request has been processed successfully. The funds should be in your account shortly.

  Thank you for using BetNinja.

  Best regards,
  BetNinja Team
`;

const depositSubject = "Deposit Request Received";
const depositBody = (username) => `
  Dear ${username},

  Your deposit request has been received. We will update your account once the transaction is confirmed.

  Tips: Play regularly and explore different lotteries for more chances to win.

  Thank you for using BetNinja.

  Best regards,
  BetNinja Team
`;

const commissionSubject = "Commission Added to Your Wallet";
const commissionBody = (username) => `
  Dear ${username},

  Congratulations! Commission has been added to your wallet.

  Tips: Utilize your earnings to participate in premium lotteries for even bigger rewards.

  Thank you for your contributions.

  Best regards,
  BetNinja Team
`;

const rebateSubject = "Rebate Added to Your Wallet";
const rebateBody = (username) => `
  Dear ${username},

  Good news! Rebate has been added to your wallet.

  Tips: Explore exclusive lottery events for additional bonuses.

  Thank you for being a valued member.

  Best regards,
  BetNinja Team
`;

const otpMailSubject = "One-Time Password (OTP) for BetNinja";
const otpMailBody = (username, generatedOTP) => `
  Dear ${username},

  Your One-Time Password (OTP) for BetNinja is ${generatedOTP}. This OTP is valid for a short duration.

  If you did not request this OTP, please contact support immediately.

  Best regards,
  BetNinja Team
`;

module.exports = {
  registrationSubject,
  registrationBody,
  loginSubject,
  loginBody,
  withdrawalRequestSubject,
  withdrawalRequestBody,
  withdrawalCompleteSubject,
  withdrawalCompleteBody,
  depositSubject,
  depositBody,
  commissionSubject,
  commissionBody,
  rebateSubject,
  rebateBody,
  otpMailSubject,
  otpMailBody,
};