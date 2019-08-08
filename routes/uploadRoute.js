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
        console.log(email);
        Store.findOne({email:email},function(err, store){
            if(err){
                console.log(err);
                return;
            } else if(store){
                let imgURL = config.urlRoot+'/uploads/'+store._id+'.jpg';
                console.log(imgURL)
                store.imgURL = imgURL;
                store.save();
                // Store.updateOne({email:email},{$set:{imgURL:imgURL}})
                cb(null,store._id+'.jpg');
            }else{
                console.log('invalid email for uploads pics')
            }
        })
        
    }
})
const storageDirect = multer.diskStorage(
    {
        //此destination路徑為專案以下的upload資料夾 上傳的檔案將傳至此檔案
        destination: '../web/dist/uploads/',
        filename:(req, file, cb)=>{
            // let fileArr = file.originalname.split('.');
            console.log('file.originalname'+file.originalname)
            cb(null,file.originalname);
        }
})
const storeBoothAvatar = multer.diskStorage({
    destination: '../web/dist/uploads/', 
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const uploadBoothAvatar = multer({storage: storeBoothAvatar});

const upload2 = multer({storage:storageDirect})

const upload = multer({storage:storage});
//                                    'storePic' -> 在postman使用post的時候要使用formdata 裡面的key值為storePic
router.post('/storePic',upload.single('storePic'),uploadController.uploadStorePic);//leadline/uploads/storePic
router.post('/storePic2',upload2.single('storePic'),uploadController.uploadStorePic2);//leadline/uploads/storePic2


router.post('/boothAvatar', uploadBoothAvatar.single('boothAvatar'), uploadController.uploadBoothAvatar);//leadline/uploads/boothAvatar


module.exports = router;