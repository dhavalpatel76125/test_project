// utils/leaderboardGenerator.js
const User = require("../Models/User");
const leaderboardService = require("../Services/leaderboardGenrator");
const log = require('../utility/logStyle')

async function generateLeaderboard(timeFrame, limit = 10) {
  try {
    let startDate;
    let endDate;

    // Determine the start and end dates based on the timeFrame
    switch (timeFrame) {
      case "today":
          await leaderboardService.fetchTodayLeaderboard();
        break;
      case "week":
          await leaderboardService.fetchWeekLeaderboard();
        break;
      case "month":
          await leaderboardService.fetchMonthLeaderboard();
        break;
      default:
        throw new Error("Invalid timeFrame");
    }

    // Fetch users with the highest scores for the specified timeFrame
    const leaderboard = await User.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .sort({ score: -1 })
      .limit(limit);

    return leaderboard;
  } catch (error) {
    console.error("Error in generateLeaderboard:", error);
    throw error;
  }
}

module.exports = generateLeaderboard;
