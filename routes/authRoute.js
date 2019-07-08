const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/getToken',authController.getToken);//leadline/auth/getToken
router.post('/checkTokenForAdmin',authController.checkTokenForAdmin);//leadlin/auth/checkTokenForAdmin

module.exports = router;