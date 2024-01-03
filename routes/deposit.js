const { Router } = require('express');
const router = Router();
const depositController=require("../Controller/depositController")
const rebate = require('../Controller/rebateController')
const authenticateToken = require("../Services/authorization");


router.post("/deposits",depositController.deposit)
router.get("/getDeposits",depositController.getDeposit)
router.get("/deposits/user/:userId",depositController.getDepositByUser)

router.post('/deposit_rebate', authenticateToken.authenticateToken,rebate.depositRebateToUser)
module.exports = router