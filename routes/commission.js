const { Router } = require('express');
const router = Router();
const commissionController = require('../Controller/commissionController')
const authenticateToken = require("../Services/authorization");

router.get('/commission', authenticateToken.authenticateToken, commissionController.getcommissionByUser)

module.exports = router