const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/getToken',authController.getToken);//leadline/auth/getToken
router.post('/checkTokenForAdmin',authController.checkTokenForAdmin);//leadlin/auth/checkTokenForAdmin
router.post('/checkToken',authController.checkToken);
router.get('/checkAuth',authController.checkAuth);
//0723，新增展位登入與給新token的post方法
router.post('/boothLogin', authController.boothLogin);
router.post('/checkBoothToken', authController.checkBoothToken);

module.exports = router;