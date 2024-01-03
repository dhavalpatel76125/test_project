const { Router } = require('express');
const router = Router();
const withdrawController=require("../Controller/withdrawController")
const authenticateToken = require("../Services/authorization");

router.post('/withdraw',authenticateToken.authenticateToken, withdrawController.withdraw)
router.get('/withdrawals',authenticateToken.authenticateToken, withdrawController.withdraw)

router.get('/withdrawals/user/:userId',withdrawController.getWithdrawByUser)
module.exports = router