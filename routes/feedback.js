const { Router } = require('express');
const router = Router();
const FeedbackController=require("../Controller/feedback")
const authenticateToken = require("../Services/authorization");

router.post("/feedback",authenticateToken.authenticateToken,FeedbackController.feedback)

router.get("/allFeedback",FeedbackController.getFeedbacks)
router.get("/feedback/:userId",FeedbackController.getFeedback)
module.exports = router