const { Router } = require('express');
const router = Router();// For sending reset emails

const BetsController=require("../../Controller/1min_BetsController")

router.post("/api/1_min_results",BetsController.OneMinBets)

module.exports = router