const config = require('../config');

const uploadStorePic = (req,res,next)=>{
    //這裡postman只能使用formdata 上傳檔案
    if(!req.file){
        res.json({status:400, msg:'Bad request'});
    }else{
        // let fileArr = req.file.originalname.split('.');
        let filePath = config.urlRoot + req.file.originalname;
        res.json({status:200, msg:{filePath:filePath}});
    }
}

module.exports = {
    uploadStorePic
}