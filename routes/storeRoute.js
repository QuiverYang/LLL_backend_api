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

//leadline/store/dumpStoreExhibit 備份店家資料並清空post visitorTime queue 並新增pastPost pastVisitorTime pastQueue 
router.put('/dumpStoreExhibit',storeController.dumpStoreExhibit);

//leadline/store/dumpOneStoreExhibit 備份一家店家資料並清空post visitorTime queue 並新增pastPost pastVisitorTime pastQueue 
router.put('/dumpOneStoreExhibit',storeController.dumpOneStoreExhibit);

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


//leadline/store/initialBoothDataByServer 返回展位資料
router.post('/initialBoothDataByServer', storeController.initialBoothDataByServer);

//leadline/store/initClientArr 第一次下載app的時候，以及登出的時候，更新排隊資料
router.post('/initClientArr', storeController.initClientArr);

//leadline/store/callClient 叫號
router.post('/callClient', storeController.callClient);

//leadline/store/scannerAdd 掃描加入排隊
router.post('/scannerAdd', storeController.scannerAdd);

//leadline/store/handAdd 手動加入排隊
router.post('/handAdd', storeController.handAdd);

//leadline/store/updateBoothInfo 更新攤位描述
router.post('/updateBoothInfo', storeController.updateBoothInfo);

//leadline/store/changeEmail 在登入狀態下更換email
router.post('/changeEmail', storeController.changeEmail);

//leadline/store/changePassword 在登入狀態下更換密碼
router.post('/changePassword', storeController.changePassword);

//leadline/store/sendFeedback 在登入狀態下sendFeedback
router.post('/sendFeedback', storeController.sendFeedback);

module.exports = router;