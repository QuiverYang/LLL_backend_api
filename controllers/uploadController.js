const config = require('../config');
const Store = require('../models/store');

const uploadStorePic = (req,res,next)=>{
    //這裡postman只能使用formdata 上傳檔案
    let email = req.query.email;
    if(!req.file){
        res.json({status:400, msg:'Bad request'});
    }else{
        // let fileArr = req.file.originalname.split('.');
        let imgURL = '';
        Store.findOne({email:email},function(err, store){
            if(err){
                console.log(err);
                return;
            }else if(store){
                imgURL = config.urlRoot+'/uploads/'+store._id+'.jpg';
            }else{
                console.log('invalid email for uploads pics')
            }
            res.json({status:200, msg:{filePath:imgURL}});
        })
        // let filePath = config.urlRoot + req.file.originalname;
    }
}
const uploadStorePic2 = (req,res,next)=>{
    //這裡postman只能使用formdata 上傳檔案
    if(!req.file){
        res.json({status:400, msg:'Bad request'});
    }else{
        let imgURL = config.urlRoot+'/uploads/'+req.file.originalname;
        res.json({status:200, msg:{filePath:imgURL}});
        // let filePath = config.urlRoot + req.file.originalname;
    }
}
const uploadBoothAvatar = async (req, res, next) => {
    let filePath = config.urlRootCharlotte31228 + req.file.originalname;
    if(!req.file){
        res.json({status: 400, booth: booth, serverMsg: '400, bad request, find file failed.', clientMsg: '無法上傳圖片，請重新嘗試'});
    }else{
        Store.findOneAndUpdate({_id: req.decoded.boothId}, {$set:{imgURL: filePath}}, {new: true}, function(err, booth)  {
            if(err || !booth)  {
                res.json({status: 404, booth: booth, serverMsg: '404, not found, find booth by _id failed.', clientMsg: '連線異常，請重新嘗試'});
                return;
            }
            res.json({status: 200, booth: booth, serverMsg: '200, ok, change booth avatar success.', clientMsg: 'Logo上傳成功'});
        });
    }
}

module.exports = {
    uploadStorePic,
    uploadBoothAvatar,
    uploadStorePic2
}