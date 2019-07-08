const express = require('express');

const router = express();

const userRouter = require('./userRoutes');
const storeRouter = require('./storeRoute');
const adminRouter = require('./adminRoute');
const testRouter = require('./testRoute');
const authRouter = require('./authRoute');


router.use('/auth',authRouter);//leadline/auth

router.use('/user', userRouter);//leadline/user
router.use('/store',storeRouter);//leadline/store
router.use('/admin',adminRouter);//leadline/admin
router.use('/test',testRouter);//leadline/test
module.exports = router;