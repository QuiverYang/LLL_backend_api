const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

router.post('/create',queueController.create);//leadline/admin/queue/create
router.post('/test',queueController.test);//leadline/admin/queue/test
router.delete('/stores',queueController.deleteAllQueue);//leadline/admin/queue/stores
router.put('/addVisitor',queueController.addVisitor);//leadline/admin/queue/addVisitor
router.put('/resetCurrentExhibit',queueController.resetCurrentExhibit);//leadline/admin/queue/resetCurrentExhibit
router.put('/setVisitorToEmpty',queueController.setVisitorToEmpty);//leadline/admin/queue/setVisitorToEmpty
router.get('/getAllQueue',queueController.getAllQueue);//leadline/admin/queue/getAllQueue

//在post裡面的key值為name 可尋找到店家 店家可為多個
//key值currentExhibit 可更改店家的參展名稱
router.put('/setStoresExihibit',queueController.setStoresExihibit);//leadline/admin/queue/setStoresExihibit  

module.exports = router;