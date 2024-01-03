const { Router } = require('express');
const router = Router();// For sending reset emails


const Lottery3MinController=require("../../Controller/3min_BetsController")

router.post("/api/1_min_results",Lottery3MinController.Bets3min)

module.exports = router