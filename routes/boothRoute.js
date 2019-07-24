const express = require('express');
const router = express.Router();
const boothController = require('../controllers/boothController');

//leadline/booth/sendForgetPswEmail  忘記密碼
router.post('/sendVerifyNumEmail',boothController.sendVerifyNumEmail);

//leadline/booth/resetPassword  重設密碼
router.post('/resetPassword',boothController.resetPassword);

module.exports = router;