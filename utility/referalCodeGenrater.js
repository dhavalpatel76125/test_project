function generateReferralCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let referralCode = "";
  for (let i = 0; i < 6; i++) {
    referralCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
    referralCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return referralCode;
}
module.exports=generateReferralCode
// Function to generate a referral code
