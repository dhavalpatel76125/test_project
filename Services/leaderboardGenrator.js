// leaderboardService.js
const thirty_sec_user_bet = require("../Models/30sec_place_bet");
const one_min_user_bet = require("../Models/1min_place_bet");
const three_min_user_bet = require("../Models/3min_place_bet");
const five_min_user_bet = require("../Models/5min_place_bet");
const moment = require("moment");

async function fetchTodayLeaderboard() {
  try {
    const startOfDay = moment().startOf("day");
    const endOfDay = moment();

    const thirty_sec_user_bet_leaderboard = await thirty_sec_user_bet.aggregate(
      [
        {
          $match: {
            status: "success",
            updatedAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalAmount: { $sum: "$phrchaseAmount" },
          },
        },
      ]
    );
    const one_min_user_bet_leaderboard = await one_min_user_bet.aggregate([
      {
        $match: {
          status: "success",
          updatedAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalAmount: { $sum: "$phrchaseAmount" },
        },
      },
    ]);
    const three_min_user_bet_leaderboard = await three_min_user_bet.aggregate([
      {
        $match: {
          status: "success",
          updatedAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalAmount: { $sum: "$phrchaseAmount" },
        },
      },
    ]);
    const five_min_user_bet_leaderboard = await five_min_user_bet.aggregate([
      {
        $match: {
          status: "success",
          updatedAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalAmount: { $sum: "$phrchaseAmount" },
        },
      },
    ]);

    const todayLeaderboard = [
      ...thirty_sec_user_bet_leaderboard,
      ...one_min_user_bet_leaderboard,
      ...three_min_user_bet_leaderboard,
      ...five_min_user_bet_leaderboard,
    ];
    const sortedLeaderboard = todayLeaderboard.sort(
      (a, b) => b.totalAmount - a.totalAmount
    );

    // Add ranking to each entry
    const rankedLeaderboard = sortedLeaderboard.map((entry, index) => ({
      rank: index + 1,
      userId: entry._id,
      totalAmount: entry.totalAmount,
    }));

    // Console.log the ranked leaderboard with rank, userId, and totalAmount
    console.log('\x1b[1m\x1b[32m\x1b[3m%s\x1b[0m', "Today's Leaderboard:");


    console.table(rankedLeaderboard, ["rank", "userId", "totalAmount"]);
    return rankedLeaderboard;
  } catch (error) {
    console.error("Error fetching today leaderboard:", error);
    throw error;
  }
}

async function fetchWeekLeaderboard() {
  try {
    const startOfDay = moment().startOf("week");
    const endOfDay = moment();

    const thirty_sec_user_bet_leaderboard = await thirty_sec_user_bet.aggregate(
        [
          {
            $match: {
              status: "success",
              updatedAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
            },
          },
          {
            $group: {
              _id: "$userId",
              totalAmount: { $sum: "$phrchaseAmount" },
            },
          },
        ]
      );
      const one_min_user_bet_leaderboard = await one_min_user_bet.aggregate([
        {
          $match: {
            status: "success",
            updatedAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalAmount: { $sum: "$phrchaseAmount" },
          },
        },
      ]);
      const three_min_user_bet_leaderboard = await three_min_user_bet.aggregate([
        {
          $match: {
            status: "success",
            updatedAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalAmount: { $sum: "$phrchaseAmount" },
          },
        },
      ]);
      const five_min_user_bet_leaderboard = await five_min_user_bet.aggregate([
        {
          $match: {
            status: "success",
            updatedAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalAmount: { $sum: "$phrchaseAmount" },
          },
        },
      ]);
  
      const todayLeaderboard = [
        ...thirty_sec_user_bet_leaderboard,
        ...one_min_user_bet_leaderboard,
        ...three_min_user_bet_leaderboard,
        ...five_min_user_bet_leaderboard,
      ];
      const sortedLeaderboard = todayLeaderboard.sort(
        (a, b) => b.totalAmount - a.totalAmount
      );
  
      // Add ranking to each entry
      const rankedLeaderboard = sortedLeaderboard.map((entry, index) => ({
        rank: index + 1,
        userId: entry._id,
        totalAmount: entry.totalAmount,
      }));
  
      // Console.log the ranked leaderboard with rank, userId, and totalAmount
      console.log('\x1b[1m\x1b[32m\x1b[3m%s\x1b[0m', "Week's Leaderboard:");
      console.table(rankedLeaderboard, ["rank", "userId", "totalAmount"]);
      return rankedLeaderboard;
  } catch (error) {
    console.error("Error fetching week leaderboard:", error);
    throw error;
  }
}

async function fetchMonthLeaderboard() {
  try {
    const startOfDay = moment().startOf("month");
    const endOfDay = moment();

    const thirty_sec_user_bet_leaderboard = await thirty_sec_user_bet.aggregate(
        [
          {
            $match: {
              status: "success",
              updatedAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
            },
          },
          {
            $group: {
              _id: "$userId",
              totalAmount: { $sum: "$phrchaseAmount" },
            },
          },
        ]
      );
      const one_min_user_bet_leaderboard = await one_min_user_bet.aggregate([
        {
          $match: {
            status: "success",
            updatedAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalAmount: { $sum: "$phrchaseAmount" },
          },
        },
      ]);
      const three_min_user_bet_leaderboard = await three_min_user_bet.aggregate([
        {
          $match: {
            status: "success",
            updatedAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalAmount: { $sum: "$phrchaseAmount" },
          },
        },
      ]);
      const five_min_user_bet_leaderboard = await five_min_user_bet.aggregate([
        {
          $match: {
            status: "success",
            updatedAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalAmount: { $sum: "$phrchaseAmount" },
          },
        },
      ]);
  
      const todayLeaderboard = [
        ...thirty_sec_user_bet_leaderboard,
        ...one_min_user_bet_leaderboard,
        ...three_min_user_bet_leaderboard,
        ...five_min_user_bet_leaderboard,
      ];
      const sortedLeaderboard = todayLeaderboard.sort(
        (a, b) => b.totalAmount - a.totalAmount
      );
  
      // Add ranking to each entry
      const rankedLeaderboard = sortedLeaderboard.map((entry, index) => ({
        rank: index + 1,
        userId: entry._id,
        totalAmount: entry.totalAmount,
      }));
  
      // Console.log the ranked leaderboard with rank, userId, and totalAmount
      console.log('\x1b[1m\x1b[32m\x1b[3m%s\x1b[0m', "Month's Leaderboard:");
      console.table(rankedLeaderboard, ["rank", "userId", "totalAmount"]);
      return rankedLeaderboard;
  } catch (error) {
    console.error("Error fetching month leaderboard:", error);
    throw error;
  }
}

module.exports = {
  fetchTodayLeaderboard,
  fetchWeekLeaderboard,
  fetchMonthLeaderboard,
};
