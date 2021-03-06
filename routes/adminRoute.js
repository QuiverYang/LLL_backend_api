const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const queueRouter = require('./queueRoute');

router.post('/create',adminController.create);//leadline/admin/create
router.get('/getAllStores', adminController.getAllStores);//leadline/admin/getAllStores
router.get('/getAllUsers',adminController.getAllUsers)//leadline/admin/getAllUsers
router.get('/getAllExhibitions',adminController.getAllExhibitions);//leadline/admin/getAllExhibitions
router.post('/test',adminController.test);//leadline/test
router.use('/queue',queueRouter);//leadline/admin/queue
module.exports = router;