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

// const storeBoothAvatar= multer.diskStorage({
//     destination: './uploads/', 
//     filename: (req, file, cb) => {
//         let email = req.query.email;
//         let password = req.query.password;
//         Store.findOne({email: email, password:password}, (err, booth) => {
//             if(err || !booth) {
//                 res.json({status: 404, serverMsg: '404, not found, find booth failure.', clientMsg: '找不到展位'});
//                 return;
//             } 
//             let imgURL = config.urlRoot+'/uploads/'+booth._id+'.jpg';
//             Store.findOneAndUpdate({email: email, password: password}, {$set:{imgURL: imgURL}}, {new: true}, function(err, booth)  {
//                 console.log(email);
//                 if(err || !booth)  {
//                     res.json({status: 400, serverMsg: '400, bad request, reset password failed.', clientMsg: '連線異常，請重新嘗試'});
//                     return;
//                 }
//                 console.log(booth);
//                 cb(null, file.originalname);
//                 res.json({status: 200, newPsw: etInputNewPsw, serverMsg: '200, ok, reset password success.', clientMsg: '照片已重設，請使用新照片登入'});
//             });
//         })
//     }
// });

const storeBoothAvatar = multer.diskStorage({
    destination: './uploads/', 
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const uploadBoothAvatar = multer({storeBoothAvatar: storeBoothAvatar});
                              
router.post('/boothAvatar', uploadBoothAvatar.single('boothAvatar'), uploadController.uploadBoothAvatar);//leadline/uploads/boothAvatar

const upload = multer({storage:storage});
//                                    'storePic' -> 在postman使用post的時候要使用formdata 裡面的key值為storePic
router.post('/storePic',upload.single('storePic'),uploadController.uploadStorePic);//leadline/upload/storePic

module.exports = router;