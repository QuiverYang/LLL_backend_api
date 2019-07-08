const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.post('/a',testController.a);
router.post('/b',testController.b);
router.post('/c',testController.c);
router.post('/d',testController.d);

module.exports = router;