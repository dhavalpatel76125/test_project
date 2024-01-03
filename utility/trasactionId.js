// myModule.js

// Function to generate a unique transaction ID
function generateTransactionId() {
    const timestamp = new Date().getTime().toString(36);
    const randomString = Math.random().toString(36).substr(2, 5);
  
    return `txn_${timestamp}_${randomString}`;
  }
  
  // Export the function so it can be used in other files
  module.exports = generateTransactionId;
  