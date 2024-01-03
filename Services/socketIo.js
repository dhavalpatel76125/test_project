const randomController = require("../Controller/randomController");
const logger = require("./logger");
// const socketHandler = (io) => {
//   io.on('connection', (socket) => {
//     console.log('Client connected');

//     const startCountdown = (duration, timerName) => {
//       let countdownDuration = duration;

//       const countdownInterval = setInterval(() => {
//         socket.emit(`updateCountdown_${timerName}`, { countdown: countdownDuration });

//         console.log(`Remaining time for ${timerName}: ${countdownDuration} seconds`);

//         // Check if the countdown has reached 5 seconds
//         if (countdownDuration === 5) {
//           // Trigger functions when countdown reaches 5 seconds
//           if (timerName === 'thirtySecTimer') {
//             // randomController.thirtySecLottery();
//           } else if (timerName === 'oneMinTimer') {
//             oneMinLottery();
//           } else if (timerName === 'threeMinTimer') {
//             threeMinLottery();
//           } else if (timerName === 'fiveMinTimer') {
//             fiveMinLottery();
//           }
//         }

//         countdownDuration--;

//         if (countdownDuration < 0) {
//           countdownDuration = duration;
//         }
//       }, 1000);

//       socket.on('disconnect', () => {
//         console.log('Client disconnected');
//       });
//     };

//     const oneMinLottery = () => {
//       console.log('oneMinLottery function triggered');
//       // Implement your logic for oneMinLottery here
//     };

//     const threeMinLottery = () => {
//       console.log('threeMinLottery function triggered');
//       // Implement your logic for threeMinLottery here
//     };

//     const fiveMinLottery = () => {
//       console.log('fiveMinLottery function triggered');
//       // Implement your logic for fiveMinLottery here
//     };

//     // Start the countdowns for each timer when a client connects
//     startCountdown(30, 'thirtySecTimer');
//     startCountdown(60, 'oneMinTimer');   // 1 minute
//     startCountdown(180, 'threeMinTimer');  // 3 minutes
//     startCountdown(300, 'fiveMinTimer');  // 5 minutes
//   });
// };

// module.exports = socketHandler;

// socketHandler.js
// socketHandler.js
const socketHandler = (io) => {
  let timersStarted = false;
  let countdownDurations = {}; // Store initial countdown durations for each timer

  const startTimers = () => {
    if (!timersStarted) {
      startCountdown(30, "thirtySecTimer");
      startCountdown(60, "oneMinTimer"); // 1 minute
      startCountdown(180, "threeMinTimer"); // 3 minutes
      startCountdown(300, "fiveMinTimer"); // 5 minutes

      timersStarted = true;
    }
  };

  const startCountdown = (duration, timerName) => {
    let countdownDuration = duration;
    countdownDurations[timerName] = duration; // Save initial countdown duration

    const countdownInterval = setInterval(() => {
      io.emit(`updateCountdown_${timerName}`, { countdown: countdownDuration });

      // console.log(`Remaining time for ${timerName}: ${countdownDuration} seconds`);

      countdownDuration--;

      if (countdownDuration === 5) {
        // Trigger functions when countdown reaches 5 seconds
        if (timerName === "thirtySecTimer") {
          randomController.thirtySecLottery();
          logger.info(
            "---------------------------------------------------------------------------------------------"
          );
        } else if (timerName === "oneMinTimer") {
          randomController.oneMinLottery();
          logger.info(
            "---------------------------------------------------------------------------------------------"
          );
        } else if (timerName === "threeMinTimer") {
          randomController.threeMinLottery();
          logger.info(
            "---------------------------------------------------------------------------------------------"
          );
        } else if (timerName === "fiveMinTimer") {
          randomController.fiveMinLottery();
          logger.info(
            "---------------------------------------------------------------------------------------------"
          );
        }
      }

      if (countdownDuration < 0) {
        clearInterval(countdownInterval);
        console.log("\x1b[1m\x1b[32m\x1b[3m%s\x1b[0m",`Countdown for ${timerName} completed`);

        // Restart the countdown by setting the duration back to its initial value
        countdownDuration = countdownDurations[timerName];
        startCountdown(countdownDurations[timerName], timerName);
      }
    }, 1000);
  };

  const oneMinLottery = () => {
    console.log("oneMinLottery function triggered");
    // Implement your logic for oneMinLottery here
  };

  const threeMinLottery = () => {
    console.log("threeMinLottery function triggered");
    // Implement your logic for threeMinLottery here
  };

  const fiveMinLottery = () => {
    console.log("fiveMinLottery function triggered");
    // Implement your logic for fiveMinLottery here
  };

  io.on("connection", (socket) => {
    console.log('\x1b[1m\x1b[33m%s\x1b[0m', 'Client connected');
    // Start the timers only if they haven't started yet
    startTimers();

    // Expose an endpoint for the frontend to fetch the current countdown values
    socket.on("fetchCountdown", (timerName) => {
      // Provide the initial countdown value
      const countdownValue = timersStarted
        ? Math.max(0, countdownDurations[timerName])
        : 0;
      socket.emit(`updateCountdown_${timerName}`, {
        countdown: countdownValue,
      });
    });

    socket.on("disconnect", () => {
     console.log('\x1b[1;31m%s\x1b[0m', 'Client disconnected');

    });
  });
};

module.exports = socketHandler;
