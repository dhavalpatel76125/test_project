const { Router } = require('express');
const router = Router();
const bankController= require("../Controller/bankController")
const authenticateToken = require("../Services/authorization");

router.post("/addBank",authenticateToken.authenticateToken,bankController.bank)
router.get("/bank",bankController.getbank)
router.get("/bank/:userId",authenticateToken.authenticateToken,bankController.getbankByUser)
module.exports = router