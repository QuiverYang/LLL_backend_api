const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

router.post('/create',storeController.create);
router.put('/update',storeController.updateStore);
router.post('/getStore',storeController.getStore);
router.get('/getAllStores',storeController.getAllStores);
router.post('/forgotPassword',storeController.getPassword);
router.put('/clearStoreExhibit',storeController.clearStoreExhibit);

module.exports = router;