const crypto = require("crypto");

function generateUniqueOrderId() {
    const id = crypto.randomBytes(16).toString("hex");
    return id;
  }

  module.exports = generateUniqueOrderId