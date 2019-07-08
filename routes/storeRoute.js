const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authController = require('../controllers/authController');

router.post('/create',storeController.create);
router.post('/forgotPassword',storeController.getPassword);
router.use(authController.checkToken);
router.put('/update',storeController.updateStore);
router.post('/getStore',storeController.getStore);
router.get('/getAllStores',storeController.getAllStores);
router.put('/clearStoreExhibit',storeController.clearStoreExhibit);

module.exports = router;