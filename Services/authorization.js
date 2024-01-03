const jwt = require('jsonwebtoken');
const logger = require("../Services/logger");
const log = require('../utility/logStyle')

  const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
  console.log(token)
    if (!token) {
      logger.error('error: Access denied. Token not provided');
      return res.status(401).json({ error: 'Access denied. Token not provided' });
    }
    
    try {
      
      const decoded = jwt.verify(token,`${process.env.SECRETKEYJWT}` );
      req.userId = decoded.userId;
      console.log(req.userId )
      logger.info(`Authorization Successful UserId : ${req.userId}`)
      next();
    } catch (error) {
      logger.error('error: Invalid token');
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
  
  module.exports = { authenticateToken };
  