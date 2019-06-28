const express = require('express');

const router = express();

const userRouter = require('./userRoutes');
const storeRouter = require('./storeRoute');
const adminRouter = require('./adminRoute');
router.use('/user', userRouter);//leadline/user
router.use('/store',storeRouter);//leadline/store
router.use('/admin',adminRouter);//leadline/admin

module.exports = router;