const { createLogger, transports, format } = require('winston');

const customFormat = format.combine(
    format.timestamp(),
    format.printf((info) => {
        const levelColors = {
            error: '\x1b[31m', // red
            warn: '\x1b[33m', // yellow
            info: '\x1b[32m', // green
            http: '\x1b[36m', // cyan
            verbose: '\x1b[35m', // magenta
            debug: '\x1b[34m', // blue
        };

        const resetColor = '\x1b[39m';

        const level = info.level.toLowerCase();
        const coloredLevel = levelColors[level] || ''; // Use color if defined

        let coloredMessage;

        // Change color of the message based on the log level
        if (level === 'error') {
            coloredMessage = `\x1b[31m${info.message}${resetColor}`; // Red color for error messages
        } else if (level === 'warn') {
            coloredMessage = `\x1b[33m${info.message}${resetColor}`; // Cyan color for other messages
        }else{
            coloredMessage = `\x1b[36m${info.message}${resetColor}`; // Cyan color for other messages
        }

        return `${info.timestamp} - [${coloredLevel}${info.level.padEnd(5)}${resetColor}] - ${coloredMessage}`;
    })
);

const logger = createLogger({
    format: customFormat,
    transports: [
        new transports.Console()
    ]
});

module.exports = logger;
