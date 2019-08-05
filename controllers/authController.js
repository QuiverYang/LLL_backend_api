const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');
const Admin = require('../models/admin');
const Booth = require('../models/store');
const Exhibition = require('../models/exhibition');

const getToken = (req,res)=>{
    let account = req.body.account;
    let password = req.body.password;
    console.log(`account: ${account}`);
    console.log(`password: ${password}`);
    Admin.find((err, users)=>{
        if(err){
            res.send(err);
        }else{
            console.log(users);
        }
    });
    
    Admin.findOne({account:account, password:password},(err,admin)=>{
        if(err){
            res.json({status:400,msg:err});
        }
        if(!admin){
            res.json({status:401,msg:'invalid user'});
            return;
        }
        var token = jwt.sign({adminId:admin._id},config.jwtSalt,{expiresIn:60*60*24*30});
        res.json({status:200,token:token});
        
        return;
    })
}
const checkToken = (req,res,next)=>{
    let token = req.headers['x-access-token'];
    console.log('!')
    if(token){
        jwt.verify(token,config.jwtSalt,(err,decoded)=>{
            if(err){
                res.json({status:401,msg:'invalid token'});
                return;
            }else{
                req.decoded = decoded;
                next();
            }
        })
    }else{
        res.json({status:400,msg:'empty token in headers'});
        return;
    }
}
const checkAuth = async (req,res,next) => {
    var token = req.query.token;
    if(token){
        jwt.verify(token,config.jwtSalt, async (err,decoded) => {
            if(err){
                res.json(err,null,res);
                return;
            }else{
                await User.update().updateAuth(decoded.email);
                res.json({status:200,msg:'Success checkAuth'})
            }
        });
        
    }else{
        res.json({status:400,msg:'Fail checkAuth'});
        return;
    }
}
const checkTokenForAdmin = (req,res,next)=>{
    var token = req.headers['x-access-token'];
    if(token){
        jwt.verify(token,config.jwtSalt,(err,decoded)=>{
            if(err){
                res.json({status:401,msg:'invalid token'});
                return;
            }else{
                req.decoded = decoded;
                res.json({status:200,msg:decoded});
            }
        })
    }else{
        res.json({status:400,msg:'empty token in headers'});
        return;
    }
}
//0723，每一次展位登入都要給新的token
const boothLogin = async(req, res, next) => {
    //先利用帳密確認使用者是哪個展位的
    //帳密是否都有輸入
    if(req.body.email.trim().length == 0 && req.body.password.trim().length == 0)  {    //信箱與密碼皆為空
        res.json({status: 404, serverMsg: '404, not found, booth login lack account and password.', clientMsg: '請輸入帳號與密碼'});
        return; 
    }
    if(req.body.email.trim().length == 0 && req.body.password.trim().length != 0)  {    //信箱為空
        res.json({status: 404, serverMsg: '404, not found, booth login lack account.', clientMsg: '請輸入帳號'});
        return; 
    }
    if(req.body.email.trim().length != 0 && req.body.password.trim().length == 0)  {    //密碼為空
        res.json({status: 404, serverMsg: '404, not found, booth login lack password.', clientMsg: '請輸入密碼'});
        return; 
    }
    //確認是否有此帳號
    let booth = await Booth.find().byEmail(req.body.email);  
    if(booth.length == 0)  {  //如果找不到帳號
        res.json({status: 404, serverMsg: '404, not found, no this booth account.', clientMsg: '帳號不存在'});
        return; 
    }
    //確認是否密碼正確
    for(let i = 0; i < booth.length; i++)  {
        if(booth[i].password == req.body.password)  {  
            //若密碼正確，確認是否api為有效期間(有效期間為策展者自己輸入，通常為開展日期前兩天 ~ 關展日期)。
            let exhibition = await Exhibition.find().byName(booth[i].currentExhibit);  
            if(new Date().getTime() < exhibition[0].start.getTime())  {
                res.json({status: 400, serverMsg: '400, bad Request, account opening time has not arrived yet.', clientMsg: '帳號尚未開放'});
                return; 
            }
            if(new Date().getTime() > exhibition[0].end.getTime())  {
                res.json({status: 400, serverMsg: '400, bad Request, account opening time has arrived.', clientMsg: '帳號已到期'});
                return; 
            }
            getBoothToken(exhibition, booth[i], req, res, next);
        }else  {
            res.json({status: 404, serverMsg: '404, not found, no this booth password.', clientMsg: '密碼錯誤'});
            return; 
        }
    }
};

//0723，當帳密、效期都正確，就給展位端一個token
const getBoothToken = (exhibition, booth, req, res, next) => {
    let token = jwt.sign({boothId: booth._id}, config.jwtSalt, {
        expiresIn: Math.round((exhibition[0].end.getTime() - new Date().getTime())/1000) //秒為單位
    });
    if(token == undefined || token == null)  {
        res.json({status: 400, serverMsg: '400, bad Request, get token failed.', clientMsg: '連線異常，請重新嘗試'});
        return; 
    }
    res.json({status: 200, booth: booth, token: token, serverMsg: '200, ok, login success.', clientMsg: '登入成功'});
};

//0723，middleware，展位端在每次呼叫api之前，先確認是否有token
const checkBoothToken = (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(token == undefined || token == null)  {
        console.log('checkBoothToken token is null or undefinded');
        res.json({status: 400, serverMsg: '400, bad Request, cannot get token.', clientMsg: '連線異常，請重新嘗試', msg:'token is null from checkBooth token'});
        
        return; 
    }
    jwt.verify(token, config.jwtSalt, (err, decoded) => { 
        if(err)  {
            res.json({status: 404, serverMsg: '404, not found, cannot verify token.', clientMsg: '連線異常，請重新嘗試'});
            return;
        }
        req.decoded = decoded;  
        //res.json({status: 200, decoded: req.decoded, serverMsg: '200, ok, check token success.', clientMsg: '身分驗證成功'});
        next();
    });
};

module.exports = {
    getToken,
    checkToken,
    checkAuth,
    checkTokenForAdmin,
    checkBoothToken,
    boothLogin

}