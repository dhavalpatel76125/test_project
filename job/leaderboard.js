const cron = require('node-cron');
const generateLeaderboard = require('../Controller/leaderboardController');
const logger = require('../Services/logger')

const processLeaderboardCron = cron.schedule('0 * * * *', async () => {
  try {
    logger.info('Running Leaderboard Genrater Cron...');
    const todayLeaderboard = await generateLeaderboard('today');

    const monthLeaderboard = await generateLeaderboard('month');

    const weekLeaderboard = await generateLeaderboard('week');
    console.log("\x1b[1m\x1b[32m\x1b[3m%s\x1b[0m",`Leaderboard generation completed.`);
    // logger.info('Leaderboard generation completed.');
  } catch (error) {
    console.error('Error in processLeaderboardCron:', error);
  }
});

module.exports = processLeaderboardCron;
