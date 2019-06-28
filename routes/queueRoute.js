const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

router.post('/stores',queueController.create);//leadline/admin/queue/stores   by post
router.post('/initAllStores',queueController.initAllStores);//leadline/admin/queue/initAllStores
router.post('/test',queueController.test);//leadline/admin/queue/test
router.delete('/stores',queueController.deleteAll);//leadline/admin/queue/stores    by delete


module.exports = router;