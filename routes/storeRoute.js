const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authController = require('../controllers/authController');
//leadline/store/create  新增一個店家
router.post('/create',storeController.create);

//leadline/store/forgotPassword  忘記密碼
router.post('/forgotPassword',storeController.getPassword);

//leadline/store/update  更新店家資訊
router.put('/update',storeController.updateStore);

//leadline/store/getStore 得到店家資訊
router.post('/getStore',storeController.getStore);

//leadline/store/getAllStores 拿到所有店家資訊
router.get('/getAllStores',storeController.getAllStores);

//leadline/store/clearStoreExhibit 清空店家目前展期資料
router.put('/clearStoreExhibit',storeController.clearStoreExhibit);

//leadline/store/searchStores 搜尋店家
router.post('/searchStores',storeController.searchStores);

//leadline/store/remove 刪除店家
router.delete('/remove',storeController.remove);

//leadline/store/getStoreSchema 拿到店家schema
router.get('/getStoreSchema',storeController.getStoreSchema);

//leadline/store/getQueueInfo 拿到店家排隊資訊並返回資料
router.get('/getQueueInfo',storeController.getQueueInfo);

//leadline/store/addPost
router.put('/addPost',storeController.addPost);

//leadline/store/clearHistory
router.put('/clearHistory',storeController.clearHistory);


module.exports = router;