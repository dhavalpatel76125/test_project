const express = require("express");
const mongoose = require("mongoose");
const http = require('http');
const socketIO = require('socket.io');
const cors = require("cors");

const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const os = require("os");
const fs = require("fs");

const multer = require("multer");
const helmet = require('helmet')
const { error } = require("console");
const morgan = require('morgan');


const rateLimit = require("express-rate-limit");



const userRouter = require("./routes/user");
const random = require("./routes/random");
const logger = require('./Services/logger');
const placeBet = require('./routes/userbet')
const withdraw = require("./routes/withdraw");
const deposit = require("./routes/deposit");
const gift =require("./routes/gift")
const bank = require("./routes/bank")
const commission = require("./routes/commission")
const processCommissionCron = require('./job/commissionDepoit')

const socketHandler = require('./Services/socketIo'); 
const { feedback } = require("./Controller/feedback");
const updateUserLevelCron = require('./job/calculateLevel')
const processLeaderboardCron = require('./job/leaderboard')
const colors = require('colors');
// const { specificApiQueue } = require('./Queue/queue'); // Queue system setup

const app = express();
const apiServer = http.createServer(app);
const ioServer = http.createServer(); // Create a separate server for Socket.IO
const io = socketIO(ioServer);

// Use morgan middleware for logging HTTP requests
const customFormat = morgan('         :method   :url    status ::status  -  Length ::res[content-length]   -   Time ::response-time ms', {
  stream: {
    write: (message) => console.log(colors.yellow(message)),
  },
});

// Use morgan middleware with the custom format
app.use(customFormat);
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes
app.use(multer().any());
app.use(helmet())


const apiPort = process.env.API_PORT || 5000;
const socketIOPort = process.env.SOCKET_PORT || 5001;

// Connect to MongoDB
mongoose.connect(`${process.env.MONGODB_URI}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  logger.info("MongoDB is connected.")
})
.catch((err)=>{
  logger.error(err)
});

// function checkDockerStatus() {
//   // Check if Docker is running
//   return os.platform() === "linux" ? isDocker() : false;
// }

// function isDocker() {
//   // Check if running inside a Docker container
//   return fs.existsSync("/.dockerenv");
// }
// Rate Limiter Middleware
// const apiLimiter = rateLimit({
//   windowMs:  60* 60 * 10000, // 1 hours
//   max: process.env.API_RATE_LIMIT,
//   standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
// });

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something went wrong!');
});


// app.get("/api/status", (req, res) => {
//   const dockerStatus = checkDockerStatus();
//   res.json({ dockerStatus });
// });

// Apply rate limiting to specific APIs
// app.use(apiLimiter)

// app.use('/api/specific', specificApiRoutes);


// app.use("/api/specific", apiLimiter);

app.use("/api/auth", userRouter);
app.use("/api/random", random);
app.use('/api/bet', placeBet)
app.use("/api/withdraw",withdraw)
app.use("/api/deposit",deposit)
app.use("/api/gift",gift)
app.use("/api/bank",bank)
app.use("/api/commission",commission)
app.use("/api/feedback",feedback)

app.get("/api/feedback/:userId",feedback)
// Security middleware (implement proper security measures)
app.get("/", (req,res)=>{
  console.log("hi")
  res.send({msg:"running"})
})

// e.g., helmet, CORS, bodyParser, authentication, etc.

// Queue system for specific API
// specificApiQueue.process(async (job) => {
//   // Implement your specific API processing logic here
//   console.log(`Processing job ${job.id}`);
// });

socketHandler(io);


// Define the cron job to run every 10 minutes
//cron.schedule('*/10 * * * *', async () => {


// Start the cron job
updateUserLevelCron.start();
processCommissionCron.start()
processLeaderboardCron.start()

logger.error('error');
logger.warn('warn');
logger.info('info');

apiServer.listen(apiPort, () => {
  logger.info(`API Server is running on port ${apiPort}`);
});

ioServer.listen(socketIOPort, () => {
  logger.info(`Socket.IO Server is running on port ${socketIOPort}`);
});
