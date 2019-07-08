const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const storeController = require('../controllers/storeController');
const authController = require('../controllers/authController');
router.post('/create',userController.create);//leadline/user/create
<<<<<<< HEAD
//router.get('/getSameGender', userController.getSameGender);
router.get('/getStore',storeController.getStore);
=======
>>>>>>> master
router.post('/login',userController.login)//leadline/user/login
// router.get('/getSameGender', userController.getSameGender);
router.use(authController.checkToken);
router.put('/update',userController.update);
router.get('/getStore',storeController.getStore);
router.get('/get', userController.getUser);//leadline/user/get
router.delete('/remove',userController.remove);//leadlin/user/remove

module.exports = router;