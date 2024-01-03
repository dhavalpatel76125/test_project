const { sendEmail } = require("../Services/Mailer");
const otpMailSubject = "One-Time Password (OTP) for BetNinja";

const otpMailBody = (username, generatedOTP) => `
  Dear ${username},

  Your One-Time Password (OTP) for BetNinja is ${generatedOTP}. This OTP is valid for a short duration.

  If you did not request this OTP, please contact support immediately.

  Best regards,
  BetNinja Team
`;

const sendOtpViaEmail = async (to, otp) => {
  try {
    const mailOptions = {
      subject: otpMailSubject,
      userData: { username: to },
      recipientEmail: to,
      body: otpMailBody(to, otp),
    };

    await sendEmail(
      mailOptions.subject,
      mailOptions.userData,
      mailOptions.recipientEmail,
      mailOptions.body
    );

    return true;
  } catch (error) {
    console.error("Error sending OTP via email:", error);
    return false;
  }
};

module.exports = sendOtpViaEmail;
