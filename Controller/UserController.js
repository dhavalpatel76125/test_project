const crypto = require("crypto");
const nodemailer = require("nodemailer"); // For sending reset emails
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../Services/logger");
//const otpGenerator = require('otp-generator');
const { sendEmail } = require("../Services/Mailer");
//const { authenticateUser } = require('../middleware/auth');
const sendOtpViaEmail = require('../Services/sendOtpViaEmail')
const { generateOTP } = require("../utility/generateOTP");



const generateReferralCode = require("../utility/referalCodeGenrater");
const commission = require("../Models/commission");
const log = require("../utility/logStyle");
const generateUniqueUID = require("../utility/generateUniqueUID");
const notificationBody = require("../utility/notifactionBody");
const { createLogger } = require("winston");

const register = async (req, res) => {
  try {
    const { email, phone, password, inviteCode } = req.body;

    // Validate the input parameters
    if (!email || !phone || !password) {
      return res.status(400).json({ error: "All parameters are required" });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email, phone });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email and Phone are already registered" });
    }

    // Check if the inviteCode is valid
    if (inviteCode) {
      const findInviteCode = await User.findOne({ inviteCode });
      if (!findInviteCode) {
        return res.status(400).json({ error: "Invalid inviteCode" });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique 6-character UID
    const uid = generateUniqueUID(6);

    // Initialize referralCode, referalUserCode, and level
    let referralCode = generateReferralCode();
    let referalUserCode = inviteCode;
    let level = 0; // Default level is 1

    // Create a new user instance
    const newUser = new User({
      email,
      phone,
      password: hashedPassword,
      level: 0,
      uid,
      inviteCode: referralCode,
      referalUserCode,
      rangeToWithdraw: 20,
      wallet: 20,
      username: email.split("@")[0], // Use the part before '@' as the username
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Create a commission record
    await commission.create({
      userId: savedUser._id,
      referalCode: referralCode,
    });

    // Check if an invite code is provided
    if (inviteCode) {
      const referringUser = await User.findOne({ inviteCode });
      if (referringUser) {
        referalUserCode = referringUser.inviteCode;
        await commission.updateOne(
          { userId: referringUser._id },
          {
            $push: {
              downline: { userId: savedUser._id, joinDate: Date.now() },
            },
            $inc: {
              "direct.number_of_register": 1,
            },
          }
        );

        if (referringUser.level < 5) {
          level = referringUser.level + 1;
          await User.updateOne({ _id: referringUser._id }, { $set: { level } });
        }

        let upcomingUser = referringUser.referalUserCode;

        while (upcomingUser != null) {
          const referringUser = await User.findOne({
            inviteCode: upcomingUser,
          });
          await commission.updateOne(
            { userId: referringUser._id },
            {
              $push: {
                downline: { userId: savedUser._id, joinDate: Date.now() },
              },
              $inc: {
                "team.number_of_register": 1,
              },
            }
          );
          if (referringUser && referringUser.level < 5) {
            level = referringUser.level + 1;
            await User.updateOne(
              { _id: referringUser._id },
              { $set: { level } }
            );
            upcomingUser = referringUser.referalUserCode;
          } else {
            upcomingUser = null;
          }
        }
      }
    }

    // Send registration email
    const registrationBody = await notificationBody.registrationBody(
      savedUser.username
    );
    await sendEmail(
      notificationBody.registrationSubject,
      {
        username: savedUser.username,
        wallet: savedUser.wallet,
        email: savedUser.email,
        phone: savedUser.phone,
        referralLevel: savedUser.level,
        language: savedUser.language,
      },
      savedUser.email,
      registrationBody
    );

    res.status(201).json({ success: true, message: "Registration successful" });
  } catch (error) {
    logger.error("Registration error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request parameters
    if (!email || !password) {
      logger.error("error: Invalid request parameters");
      return res
        .status(400)
        .json({ status: false, message: "Invalid request parameters" });
    }

    // Find the user by email
    const user = await User.findOne({ email: email.trim() });

    if (!user) {
      logger.error("error: Invalid credentials");
      return res
        .status(401)
        .json({ status: false, message: "user not registred" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      logger.error("error: Invalid credentials");
      return res
        .status(401)
        .json({ status: false, message: "please enter correct password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, `${process.env.SECRETKEYJWT}`);

    const loginBody = await notificationBody.loginBody(user.username);

    // Check if user has the username property
    if (!user.username) {
      logger.error("Error: user.username is undefined");
      // Handle the error or return a response indicating the issue
    } else {
      // Call sendEmail with the awaited loginBody
      sendEmail(
        notificationBody.loginSubject,
        {
          username: user.username,
        },
        user.email,
        loginBody
      );
    }
    // Send the token in the response
    res.status(200).json({ token });
  } catch (error) {
    logger.error("Error during login:", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
};

const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a random OTP (4 digits)
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiration = new Date(Date.now() + 600000); // 10 minutes

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user with the OTP and expiration date
    user.resetOtp = {
      otp: otp,
      expirAt: otpExpiration,
    };
    await user.save();

    // Send the OTP to the user's email
    const emailSent = await sendOtpViaEmail(user.email, otp);

    if (emailSent) {
      res.status(200).json({ message: 'OTP sent successfully' });
    } else {
      res.status(500).json({ error: 'Error sending OTP via email' });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: 'Error processing password reset request' });
  }
};

// Reset password API
const resetPassword = async (req, res) => {
  try {
    const { userId, resetToken, newPassword } = req.body;
console.log(req.body)
    // Validate the reset token and user ID
    const user = await User.findOne({ _id: userId, resetToken: resetToken });
console.log(User)
    if (!user) {
      return res.status(404).json({ error: "Invalid reset token or user ID" });
    }

    // Check if the reset token is expired
    if (user.resetTokenExpires < Date.now()) {
      return res.status(401).json({ error: "Reset token has expired" });
    }

    // Update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Invalidate or remove the reset token
    user.resetToken = null;
    user.resetTokenExpires = null;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    logger.error("Reset password error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// write change pass. Api
const changePassword = async (req, res) => {
  try {
    const { resetToken, oldPassword, newPassword } = req.body;

    // Find the user by the reset token
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }, // Check if the token is still valid
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // If oldPassword is provided, check if it matches the current password
    if (oldPassword && !(await user.comparePassword(oldPassword))) {
      return res.status(401).json({ error: "Invalid old password" });
    }

    // Set the new password and clear the reset token fields
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// feedback model and api

//

const getUserById = async (req, res) => {
  try {
    const userId = req.userId;

    // Find the user by ID using Mongoose
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Return the user data
    res.json(user);
  } catch (error) {
    logger.error("Error during user retrieval:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserByEmailOrPhone = async (req, res) => {
  try {
    const { identifier, value } = req.query;
    // Validate request parameters
    if (!identifier || !value) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }
    let user;
    if (identifier === "email") {
      user = await User.findOne({ email: value.trim() });
    } else if (identifier === "phone") {
      user = await User.findOne({ phone: value.trim() });
    } else {
      return res
        .status(400)
        .json({ error: 'Invalid identifier, use "email" or "phone"' });

     
    }
    // Return the user data
    res.json(user);
  } catch (error) {
    logger.error("Error during user retrieval:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  register,
  LoginUser,
  ForgotPassword,
  resetPassword,
  getUserById,
  getUserByEmailOrPhone,
  changePassword,
};
