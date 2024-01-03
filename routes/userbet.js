const { Router } = require("express");
const router = Router();

const bet = require("../Controller/userBetController");
const authenticateToken = require("../Services/authorization");

router.post(
  "/30secbet",
  authenticateToken.authenticateToken,
  bet.ThirtySecBets
);

router.post("/1minbet",authenticateToken.authenticateToken, bet.OneMinBets);

router.post("/3minbet",authenticateToken.authenticateToken, bet.ThreeMinBets);

router.post("/5minbet",authenticateToken.authenticateToken, bet.FiveMinBets);

// to fetch user by user id place_bet

router.get(
  "/30secbet",
  authenticateToken.authenticateToken,
  bet.getThirtySecBets
);

router.get("/1minbet", authenticateToken.authenticateToken, bet.getOneMinBets);

router.get(
  "/3minbet",
  authenticateToken.authenticateToken,
  bet.getThreeMinBets
);

router.get("/5minbet", authenticateToken.authenticateToken, bet.getFiveMinBets);

module.exports = router;
