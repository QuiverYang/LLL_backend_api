const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

router.post('/stores',queueController.create);//leadline/admin/queue/stores
router.post('/initAllStores',queueController.initAllStores);//leadline/admin/queue/initAllStores
router.post('/test',queueController.test);//leadline/admin/queue/test
router.delete('/stores',queueController.deleteAll);//leadline/admin/queue/stores

//在post裡面的key值為name 可尋找到店家 店家可為多個
//key值currentExhibit 可更改店家的參展名稱
router.post('/setStoresExihibit',queueController.setStoresExihibit);//leadline/admin/queue/setStoresExihibit  

module.exports = router;