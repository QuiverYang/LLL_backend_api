const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.post('/a',testController.a);

module.exports = router;