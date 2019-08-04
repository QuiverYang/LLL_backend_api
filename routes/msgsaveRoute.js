const express = require('express');
const router = express.Router();
const magsaveController = require('../controllers/magsaveController');

//leadline/msgsave/initMsgArr 
router.post('/initMsgArr',magsaveController.initMsgArr);

//leadline/msgsave/sendAddMsg 
router.post('/sendAddMsg',magsaveController.sendAddMsg);

//leadline/msgsave/sendReplaceMsg   
router.post('/sendReplaceMsg',magsaveController.sendReplaceMsg);

//leadline/msgsave/sendDeleteMsg  
router.post('/sendDeleteMsg',magsaveController.sendDeleteMsg);

module.exports = router;