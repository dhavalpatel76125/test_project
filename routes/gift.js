const { Router } = require('express');
const router = Router();// For sending reset emails
const giftController = require("../Controller/giftController")
const authenticateToken = require("../Services/authorization");

router.post("/gifts",giftController.addGift)
router.post('/api/redeem-gift', authenticateToken.authenticateToken,giftController.redeemGift);
router.post('/api/withdraw-gift-card', giftController.withdrawGiftCard);


module.exports = router