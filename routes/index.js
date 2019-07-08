const express = require('express');

const router = express();

const userRouter = require('./userRoutes');
const storeRouter = require('./storeRoute');
const adminRouter = require('./adminRoute');
const testRouter = require('./testRoute');
const authRoute = require('./authRoute.js');
const emailRoute = require('./emailRoute');
const authController = require('../controllers/authController');

router.use('/user', userRouter);//leadline/user
router.use('/store',storeRouter);//leadline/store
router.use('/admin',adminRouter);//leadline/admin
router.use('/test',testRouter);//leadline/test
router.use('/auth',authRoute);
router.use('/email',emailRoute);
router.use(authController.checkToken);

module.exports = router;