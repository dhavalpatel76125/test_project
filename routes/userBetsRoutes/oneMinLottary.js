const { Router } = require('express');
const router = Router();// For sending reset emails


const Lottery1MinController=require("../../Controller/1minLottaryController")

router.post("/lottery",Lottery1MinController.OneMinLottary)

module.exports = router