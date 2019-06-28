const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const storeController = require('../controllers/storeController');

router.get('/get', userController.getUser);//leadline/user/get
router.post('/create',userController.create);
router.get('/getSameGender', userController.getSameGender);
router.get('/getStore',storeController.getStore);

module.exports = router;