const { Router } = require("express");

const router = Router(); // For sending reset emails

const randomController = require("../Controller/randomController");

router.post("/30secLottary", randomController.thirtySecLottery);

router.post("/1minLottary", randomController.oneMinLottery);

router.post("/3minLottary", randomController.threeMinLottery);

router.post("/5minLottary", randomController.fiveMinLottery);


router.get("/30secLottary", randomController.getAll30SecLottery);

router.get("/1minLottary", randomController.getAll1minLottery);

router.get("/3minLottary", randomController.getAll3MinLottery);

router.get("/5minLottary", randomController.getAll5MinLottery);


router.get("/30secLottaryLatest", randomController.getlatest30SecLottery);

router.get("/1minLottaryLatest", randomController.getlatest1minLottery);

router.get("/3minLottaryLatest", randomController.getlatest3MinLottery);

router.get("/5minLottaryLatest", randomController.getlatest5MinLottery);

module.exports = router;
