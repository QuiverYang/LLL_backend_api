const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const storeController = require('../controllers/storeController');

router.get('/get', userController.getUser);//leadline/user/get
router.post('/create',userController.create);//leadline/user/create
//router.get('/getSameGender', userController.getSameGender);
router.get('/getStore',storeController.getStore);
router.post('/login',userController.login)//leadline/user/login

module.exports = router;