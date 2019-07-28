const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

//leadline/store/create  新增一個展位
router.post('/create', storeController.create);

//leadline/store/forgotPassword  忘記密碼
router.post('/forgotPassword', storeController.getPassword);

//leadline/store/getStoreSchema  拿到展位schema
router.get('/getStoreSchema', storeController.getStoreSchema);

//leadline/store/searchStores 搜尋展位
router.post('/searchStores', storeController.searchStores);

//leadline/store/update  更新展位資訊
router.put('/update', storeController.updateStore);

//leadline/store/getStore  取得展位資訊
router.post('/getStore', storeController.getStore);

//leadline/store/getAllStores  取得所有展位資訊
router.get('/getAllStores', storeController.getAllStores);

//leadline/store/getQueueInfo 拿到展位排隊資訊並返回資料
router.get('/getQueueInfo', storeController.getQueueInfo);

//leadline/store/getQueueInfo2 拿到展位排隊資訊並返回
router.get('/getQueueInfo2', storeController.getQueueInfo2);

//leadline/store/clearStoreExhibit 清空展位目前展期資料
router.put('/clearStoreExhibit', storeController.clearStoreExhibit);

//leadline/store/remove 刪除展位
router.delete('/remove', storeController.remove);

//leadline/store/initialBoothDataByServer 返回展位資料
router.post('/remove', storeController.initialBoothDataByServer);

module.exports = router;