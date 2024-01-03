const Feedback = require("../Models/feedback");
const logger = require("../Services/logger");
const log = require('../utility/logStyle')

// POST endpoint to submit feedback
const feedback = async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;

    // Validate request parameters
    if (!userId || !rating || !comment) {
      return res.status(400).json({ error: "Incomplete feedback data" });
    }

    // Create a new feedback document
    const feedbackEntry = new Feedback({ userId, rating, comment });

    // Save the feedback to the database
    await feedbackEntry.save();

    res.json({ success: true, message: "Feedback submitted successfully" });
  } catch (error) {
    logger.error("Error submitting feedback:", error);

    // Handle specific Mongoose validation error
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json({ error: "Validation Error", details: validationErrors });
    }

    // Handle duplicate key error (unique constraint)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Duplicate key error", details: error.keyValue });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};
const feedbackByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate the user ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Retrieve feedback entries by user ID from the database
    const feedbackEntries = await Feedback.find({ userId });

    res.json({ success: true, feedback: feedbackEntries });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const feedbackEntries = await Feedback.find();

    res.json({ success: true, feedback: feedbackEntries });
  } catch (error) {
    logger.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { feedback, getFeedbacks, feedbackByUserId };
