const nodemailer = require('nodemailer');
const crypto = require('crypto');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  
  secure: false,
  auth: {
    user: 'csnetwork804@gmail.com',
    pass: 'alos ikdr aiuq omec',
  },
});



const sendEmail = async (subject, userData, recipientEmail, body) => {
  try {
    const mailOptions = {
      from: 'BetNinja <csnetwork804@gmail.com>', // replace with your email
      to: recipientEmail,
      subject: subject,
      text: body, // Assuming your body is in plain text format
    };
    console.log('Sending email:', mailOptions); // Add this log
    // Use nodemailer to send the email
    const info = await transporter.sendMail(mailOptions);
  

    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // rethrow the error for handling in your API code




  }
};







module.exports = { sendEmail };
