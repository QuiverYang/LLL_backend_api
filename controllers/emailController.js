const jwt = require('jsonwebtoken');
const config = require('../config');
var nodemailer = require('nodemailer');
const User = require('../models/user');

const test = (req,res)=>{
    res.send('email test route')
}
const send2 = function(toEmail,emailSubject, emailContent){
    var transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:'ccc72077@gmail.com',
            pass:'ss72077!'
        }
    });
    
    var options = {
        from: 'ccc72077@gmail.com',
        to:toEmail,
        subject: emailSubject,
        html: emailContent,
        attachments: [ {
            filename: '',
            path: ''
        }]
    }
    
    transporter.sendMail(options,function(error,info){
        if(error){
            console.log(error);
        }else{
            console.log('訊息發送:'+info.response);
        }
    })
}

const send = (req,res,next) =>{
    let email = req.body.email;
    console.log('register email: '+ email)
    var token = jwt.sign({email:email},config.jwtSalt,{
        expiresIn: 60*60*24//24hr
    });
    var transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:'ccc72077@gmail.com',
            pass:'ss72077!'
        }
    });
    
    var options = {
        from: 'ccc72077@gmail.com',
        to:email,
        subject: '這是 LeadLongLine 發送的驗證信件',
        html: '<h2>請點擊連結啟動帳號</h2> <p><a href="http://34.80.102.113:3000/leadline/auth/checkAuth?token='+token+'" title="LeadLongLine">點擊這裡</a> 之後請回app重新登入</p>',
    }
    
    transporter.sendMail(options,function(error,info){
        if(error){
            console.log(error);
            res.json({status:400,msg:'send fail'});
        }else{
            console.log('訊息發送:'+info.response);
            res.json({status:200,msg:'send success'});
        }
    })
}
const sendPassword = async(req,res,next) =>{
    let email = req.body.email;
    let user = await User.findOneByEmail(email);
    if (user == null){
        res.json({status:401,msg:email+' does not exsist'});
        return 
    }
    
    var transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:'ccc72077@gmail.com',
            pass:'ss72077!'
        }
    });
    
    var options = {
        from: 'ccc72077@gmail.com',
        to:'s72077@hotmail.com',
        subject: '這是 Lead Long Line 發送的信',
        html: '<h2>帳號:'+email+'</h2><h3>-------------------------------------------------</h3><p>密碼: '+user.password+' </p>',
        attachments: [ {
            filename: '',
            path: ''
        }]
    }
    
    transporter.sendMail(options,function(error,info){
        if(error){
            console.log(error);
            res.json({status:400,msg:'send password fail'});
        }else{
            console.log('訊息發送:'+info.response);
            res.json({status:200,msg:'send password success'});
        }
    })
}
//0806
const sendSystemEmail = (req, res, next, to, subject, text, html, verifyNum, sendVerifyNumTime) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'LeadLongLineBooth@gmail.com',
            pass: 'qpalzm794613'
        }
    });
    let options = {
        from: 'Lead Long Line展覽端',
        to: to,
        subject: subject,
        text: text,
        html: html,
        //如果要發送附件，再加以下
        // attachments: [{
        //     filename: '',
        //     path: ''
        // }]
    }
    transporter.sendMail(options, (error, info) => {
        if(error)  {
            console.log('發送信件錯誤：' + error);
            res.json({status: 400, serverMsg: '400, bad Request,, send forget psw verify email failure.', clientMsg: '連線異常，請重新嘗試'});
            return; 
        }
        if(!info)  {
            console.log('發送信件錯誤，找不到info');
            res.json({status: 400, serverMsg: '400, bad Request,, send forget psw verify email failure.', clientMsg: '連線異常，請重新嘗試'});
            return;
        }
        console.log('發送信件成功' + info.response);
        res.json({status: 200, verifyNum: verifyNum, sendVerifyNumTime: sendVerifyNumTime, serverMsg: '200, ok, send forget psw verify email success.', clientMsg: '驗證碼已發送至' + to});
    });
};


const sendFeedbackEmail = (req, res, next, to, subject, text, booth) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'LeadLongLineBooth@gmail.com',
            pass: 'qpalzm794613'
        }
    });
    let options = {
        from: booth.email,
        to: to,
        subject: subject,
        text: text,
    }
    transporter.sendMail(options, (error, info) => {
        if(error)  {
            console.log('發送信件錯誤：' + error);
            res.json({status: 400, serverMsg: '400, bad Request,, send feedback email failure.', clientMsg: '連線異常，請重新嘗試'});
            return; 
        }
        if(!info)  {
            console.log('發送信件錯誤，找不到info');
            res.json({status: 400, serverMsg: '400, bad Request,, send feedback email failure.', clientMsg: '連線異常，請重新嘗試'});
            return;
        }
        console.log('發送信件成功' + info.response);
        res.json({status: 200, booth: booth, serverMsg: '200, ok, send feedback email success.', clientMsg: '提交成功'});
    });
};

module.exports = {
    send,
    sendPassword,
    test,
    send2,
    sendSystemEmail,
    sendFeedbackEmail
}