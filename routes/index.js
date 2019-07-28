const express = require('express');

const router = express();

const userRouter = require('./userRoutes');
const storeRouter = require('./storeRoute');
const boothRoute = require('./boothRoute');
const adminRouter = require('./adminRoute');
const testRouter = require('./testRoute');
const authRouter = require('./authRoute');
const emailRouter = require('./emailRoute');
const authController = require('../controllers/authController');
const uploadRouter = require('./uploadRoute');
const exhibitionRouter = require('./exhibitionRoute')

router.use('/auth',authRouter);//leadline/auth
router.use('/booth',boothRoute);//leadline/booth，0723：展位端不需要通過token認證的api
router.use(authController.checkBoothToken);  //0723：展位端每次登入的token認證
router.use('/store',storeRouter);//leadline/store，0723：展位端需要通過token認證的api
router.use('/user', userRouter);//leadline/user
router.use('/admin',adminRouter);//leadline/admin
router.use('/test',testRouter);//leadline/test
router.use('/email',emailRouter);//leadline/email
router.use('/uploads',uploadRouter);//leadline/uploads
router.use('/exhibition',exhibitionRouter)//leadline/exhibition
// router.use(authController.checkToken);

module.exports = router;

