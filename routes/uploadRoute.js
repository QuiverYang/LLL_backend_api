const express = require('express');

const uploadController = require('../controllers/uploadController');

const router = express.Router();

const multer = require('multer');

const Store = require('../models/store');

const config = require('../config');

const storage = multer.diskStorage(
    {
    //此destination路徑為專案以下的upload資料夾 上傳的檔案將傳至此檔案
    destination: '../web/dist/uploads/',
    filename:(req, file, cb)=>{
        // let fileArr = file.originalname.split('.');
        // cb(null,file.originalname);
        // let storeId = req.decoded;
        let email = req.query.email;
        Store.findOne({email:email},function(err, store){
            if(err){
                console.log(err);
                return;
            } else{
                console.log(store)
                let imgURL = config.urlRoot+'/uploads/'+store._id+'.jpg';
                Store.updateOne({email:email},{imgURL:imgURL})
                cb(null,store._id+'.jpg');
            }
        })
        
    }
})

const upload = multer({storage:storage});
//                                    'storePic' -> 在postman使用post的時候要使用formdata 裡面的key值為storePic
router.post('/storePic',upload.single('storePic'),uploadController.uploadStorePic);//leadline/upload/storePic

module.exports = router;