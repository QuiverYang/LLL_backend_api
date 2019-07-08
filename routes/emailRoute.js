const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/send',emailController.send);
router.post('/sendPassword',emailController.sendPassword);

module.exports = router;