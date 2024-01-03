const User = require('../Models/User');
const cron = require('node-cron');
const logger = require('../Services/logger');

const updateUserLevelCron = cron.schedule('*/10 * * * *', async () => {
    logger.info('Running Update User Level Cron...');
  
    try {
      // Find users with exp greater than or equal to specific thresholds and update their level
      const usersToUpdate = await User.find({
        'user_level.exp': {
          $gte: 1500,
        },
      });
  
      // Update user levels based on exp thresholds
      for (const user of usersToUpdate) {
        let newLevel = 0;
  
        // Update newLevel based on exp thresholds
        if (user.user_level.exp >= 1500) newLevel = 1;
        if (user.user_level.exp >= 9000) newLevel = 2;
        if (user.user_level.exp >= 27000) newLevel = 3;
        if (user.user_level.exp >= 30000) newLevel = 4;
        if (user.user_level.exp >= 500000) newLevel = 5;
        if (user.user_level.exp >= 3000000) newLevel = 6;
        if (user.user_level.exp >= 8000000) newLevel = 7;
        if (user.user_level.exp >= 50000000) newLevel = 8;
        if (user.user_level.exp >= 100000000) newLevel = 9;
        if (user.user_level.exp >= 1000000000) newLevel = 10;
  
        // Update the user's level in the database
        if(newLevel>user.user_level.level){
        //   console.log(newLevel,"----",user.user_level.level,"------",user.user_level.exp)
          const level_reward = `user_level.levels.${newLevel}.level_reward`;
          const monthly_reward = `user_level.levels.${newLevel}.monthly_reward`;
          
           await User.updateOne(
            { _id: user._id },
            {
              $set: {
                'user_level.level': newLevel,
                [level_reward]: true,
                [monthly_reward]: true,
              },
            }
          );
          
          
  
          logger.info(`user ${user._id} updated to level ${newLevel}`);
        }
      }
      console.log("\x1b[1m\x1b[32m\x1b[3m%s\x1b[0m",`Update User Leve lCron completed`);
      // logger.info('Update User Level Cron completed.');
    } catch (error) {
      logger.error('Error in updateUserLevelCron:', error);
    }
  });

  module.exports = updateUserLevelCron