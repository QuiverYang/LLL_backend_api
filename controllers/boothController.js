const Store = require('../models/store');
const emailController = require('../controllers/emailController');
const nodemailer = require('nodemailer');

let sendVerifyNumTime;
const sendForgetPswEmail = async(req, res, next) => {
    let email = req.body.email;
    if(email == null || email == undefined)  {    //找不到信箱
        res.json({status: 404, serverMsg: '404, not found, email null or undefined.', clientMsg: '連線異常，請重新嘗試'});
        return; 
    }
    if(email.trim().length == 0)  {    //信箱欄為空
        res.json({status: 404, serverMsg: '404, not found, find password lack email.', clientMsg: '請輸入信箱'});
        return; 
    }
    let booth = await Store.findOne().byEmail(email);
    if(!booth)  {
        res.json({status: 404, serverMsg: '404, not found, find booth by email failure.', clientMsg: '此信箱尚未註冊'});
        return;
    }
    let verifyNum = getRandom(100001, 999998);
    let to = email;
    let subject = '忘記密碼通知(送出時間：' + new Date().toLocaleString() + ')';
    let text = '敬愛的Lead Long Line展覽端用戶您好：\n\n'
                + '驗證碼' + verifyNum + '，請於10分鐘內輸入驗證碼以繼續完成密碼重設。\n\n'
                + '若您非Lead Long Line(展覽端)用戶則不必理會此郵件。\n\n'
                + '****此郵件為系統自動發送，請勿直接回信，謝謝您。****';
    let html = '';
    //let html = `<h2>店家帳號:${'沒帳號'}</h2> <h3>店家密碼:${booth.password}</h3>`
    emailController.sendSystemEmail(req, res, next, to, subject, text, html);
    sendVerifyNumTime = new Date().getTime();
}

//驗證碼用過後失效，驗證碼重發後舊的失效，驗證碼一分鐘後才可再重發，有效期10分鐘。
//驗證碼通過後才讓使用者更改密碼。

const getRandom = (min, max) => {
    return Math.floor(Math.random()*(max - min + 1)) + min;
};

module.exports = {
    sendForgetPswEmail
}