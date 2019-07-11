const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const storeController = require('../controllers/storeController');
const authController = require('../controllers/authController');
router.post('/create',userController.create);//leadline/user/create
router.get('/getStore',storeController.getStore);
router.post('/login',userController.login)//leadline/user/login
router.get('/getAllQueue',userController.getAllQueue)//leadlin/user/getAllQueue
router.put('/update',userController.update);
router.get('/getStore',storeController.getStore);
router.get('/get', userController.getUser);//leadline/user/get
router.delete('/remove',userController.remove);//leadlin/user/remove

module.exports = router;