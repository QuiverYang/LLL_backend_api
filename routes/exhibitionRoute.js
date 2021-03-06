const express = require('express');
const router = express.Router();
const exhibitionController = require('../controllers/exhibitionController');

//leadline/exhibition/getAllExhibitName 拿到全部展覽名稱
router.get('/getAllExhibitName',exhibitionController.getAllExhibitName);

//leadline/exhibition/getExhibitionSchema
router.get('/getExhibitionSchema',exhibitionController.getExhibitionSchema);

//leadline/exhibition/create 新增展覽
router.post('/create',exhibitionController.create);

//leadline/exhibition/update
router.put('/update',exhibitionController.update);

//leadline/exhibition/remove
router.delete('/remove', exhibitionController.remove);

//leadline/exhibition/getAllPosts
router.get('/getAllPosts',exhibitionController.getAllPosts);

//leadline/exhibition/getAllPostsLength
router.get('/getAllPostsLength',exhibitionController.getAllPostsLength);

//leadline/exhibition/getNamesAndAddress
router.get('/getNamesAndAddress',exhibitionController.getNamesAndAddress);

router.put('/addStores',exhibitionController.addStores);

//leadline/exhibition/getDate 拿到start and end的日期
router.get('/getDate',exhibitionController.getDate);
module.exports = router;