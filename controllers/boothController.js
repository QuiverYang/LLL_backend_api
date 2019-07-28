const Store = require('../models/store');
const emailController = require('../controllers/emailController');
const nodemailer = require('nodemailer');

const sendVerifyNumEmail = async(req, res, next) => {
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
    let verifyNum = String(getRandom(100001, 999998));
    let sendVerifyNumTime = getCurrentTime(new Date(new Date().getTime() + 28800000));  //+ 28800000是因時區問題
    let to = email;
    let subject = '忘記密碼通知(送出時間：' + sendVerifyNumTime + ')';
    let text = '敬愛的Lead Long Line展覽端用戶您好：\n\n'
                + '驗證碼' + verifyNum + '，請於10分鐘內輸入驗證碼以繼續完成密碼重設。\n\n'
                + '若您非Lead Long Line展覽端用戶則不必理會此郵件。\n\n'
                + '****此郵件為系統自動發送，請勿直接回回覆本信件，謝謝您。****';
    let html = '';
    //let html = `<h2>店家帳號:${'沒帳號'}</h2> <h3>店家密碼:${booth.password}</h3>`
    emailController.sendSystemEmail(req, res, next, to, subject, text, html, verifyNum, sendVerifyNumTime);
};

const resetPassword = async(req, res, next) => {
    let email = req.body.email;
    let etInputNewPsw = req.body.etInputNewPsw;
    let etCheckNewPsw = req.body.etCheckNewPsw;
    if(etInputNewPsw.trim() != etCheckNewPsw.trim())  {
        res.json({status: 404, serverMsg: '404, not found, password not same.', clientMsg: '密碼不相符'});
        return;
    }
    if(etInputNewPsw.trim().length < 6) {
        res.json({status: 404, serverMsg: '404, not found, password digits can not less than 6.', clientMsg: '密碼不得少於6位數'});
        return;
    }
    if(etInputNewPsw.trim().length > 20) {
        res.json({status: 404, serverMsg: '404, not found, password digits can not more than 20.', clientMsg: '密碼不得大於20位數'});
        return;
    }
    if(checkPswFormatValid(etInputNewPsw.trim())) {
        res.json({status: 404, serverMsg: '404, not found, password contains invalid symbol.', clientMsg: '密碼僅可由英文與數字組成'});
        return;
    }
    if(checkIfPswContainEnglishAndNum(etInputNewPsw.trim())) {
        res.json({status: 404, serverMsg: '404, not found, password contains english and num.', clientMsg: '密碼需同時包含英文與數字'});
        return;
    }
    
    Store.findOneAndUpdate({email: email}, {$set:{password: etInputNewPsw}}, {new: true}, function(err, booth)  {
        console.log(email);
        if(err || !booth)  {
            res.json({status: 400, serverMsg: '400, bad request, reset password failed.', clientMsg: '連線異常，請重新嘗試'});
            return;
        }
        console.log(booth);
        res.json({status: 200, newPsw: etInputNewPsw, serverMsg: '200, ok, reset password success.', clientMsg: '密碼已重設，請使用新密碼登入'});
    });
};


const getRandom = (min, max) => {
    return Math.floor(Math.random()*(max - min + 1)) + min;
};

const getCurrentTime = (date) => {
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + 
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
};

const checkPswFormatValid = (etInputNewPsw) => {
    for(let i = 0; i < etInputNewPsw.length; i++)  {
        if(!((48 <= etInputNewPsw.charAt(i).charCodeAt() && etInputNewPsw.charAt(i).charCodeAt() <= 57)
            || (65 <= etInputNewPsw.charAt(i).charCodeAt() && etInputNewPsw.charAt(i).charCodeAt() <= 90)
            || (97 <= etInputNewPsw.charAt(i).charCodeAt() && etInputNewPsw.charAt(i).charCodeAt() <= 122)))  {
            return true;
        }
    }
    return false;
};

const checkIfPswContainEnglishAndNum = (etInputNewPsw) => {
    let countNumber = 0;
    let countEnglish = 0;
    for(let i = 0; i < etInputNewPsw.length; i++)  {
        if(48 <= etInputNewPsw.charAt(i).charCodeAt() && etInputNewPsw.charAt(i).charCodeAt() <= 57)  {
            countNumber++;
        }else if((65 <= etInputNewPsw.charAt(i).charCodeAt() && etInputNewPsw.charAt(i).charCodeAt() <= 90)
                 || (97 <= etInputNewPsw.charAt(i).charCodeAt() && etInputNewPsw.charAt(i).charCodeAt() <= 122))  {
            countEnglish++;
        }
    }
    return countNumber == 0 || countEnglish == 0;
};

module.exports = {
    sendVerifyNumEmail,
    resetPassword
}