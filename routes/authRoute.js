<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/getToken',authController.getToken);
router.post('/checkToken',authController.checkToken);
router.get('/checkAuth',authController.checkAuth);


=======
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/getToken',authController.getToken);//leadline/auth/getToken
router.post('/checkTokenForAdmin',authController.checkTokenForAdmin);//leadlin/auth/checkTokenForAdmin

>>>>>>> master
module.exports = router;