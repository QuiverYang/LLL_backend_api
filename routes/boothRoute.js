const express = require('express');
const router = express.Router();
const boothController = require('../controllers/boothController');

//leadline/booth/sendForgetPswEmail  忘記密碼
router.post('/sendForgetPswEmail',boothController.sendForgetPswEmail);

module.exports = router;