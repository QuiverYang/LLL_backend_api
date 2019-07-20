const express = require('express');
const router = express.Router();
const exhibitionController = require('../controllers/exhibitionController');

//leadline/exhibition/getAllExhibitName 拿到全部展覽名稱
router.get('/getAllExhibitName',exhibitionController.getAllExhibitName);

//leadlin/exhibition/create 新增展覽
router.post('/create',exhibitionController.create)


module.exports = router;