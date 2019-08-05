const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.get('/a',testController.a);
router.post('/b',testController.b);
router.post('/c',testController.c);
router.post('/d',testController.d);
router.get('/createUser',testController.createUser);
router.put('/dumpStoreExhibit',testController.dumpStoreExhibit);

module.exports = router;