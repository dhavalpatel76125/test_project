function log(message) {
    console.log("\x1b[1m\x1b[32m\x1b[3m%s\x1b[0m", message);
}

module.exports = log