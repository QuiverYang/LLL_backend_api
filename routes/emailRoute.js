const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/send',emailController.send);//leadline/email/send
router.post('/sendPassword',emailController.sendPassword);
router.post('/test',emailController.test);


router.post('/sendSystemEmail',emailController.sendSystemEmail);  //0802
router.post('/sendFeedbackEmail',emailController.sendFeedbackEmail);  //0802

module.exports = router;