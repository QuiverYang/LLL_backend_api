const Store = require('../models/store');
const Checker = require('../utils/checker');
const User = require('../models/user')
const Queue = require('../models/queue');
const emailController = require('../controllers/emailController');
const StoreSchema = require('mongoose').model('Store').schema;
const Exhibition = require('../models/exhibition');
const boothController = require('../controllers/boothController');
const Msgsave = require('../models/msgsave');
const Message = require('../models/message');

const create = async(req, res, next) => {
    let name = req.body.name;
    let email = req.body.email
    let password = req.body.password;
    let address = req.body.address;
    let phone = req.body.phone;
    let info = req.body.info;
   
    let currentExhibit = req.body.currentExhibit;
    let boothNo = req.body.boothNo;
    let postAuth = req.body.postAuth;
    let queue = await Queue.create({
        exhibitionName: currentExhibit,
        storeName : name,
        current : 0,
        total: 0,
        visitor: []
    });
    //因為model裡面有設定預設值 所以undefined的值 可以為'暫未提供'
    let store = new Store({
        name: name,
        email:email,
        password:password,
        address:address,
        phone: phone,
        info: info,
        
        currentExhibit:currentExhibit,
        boothNo:boothNo,
        postAuth:postAuth,
        queue:queue,
    });

    store.save().then(() => {
        console.log('store created');
        res.json({status: 200, msg: store});
    });
};

const getPassword = async (req, res, next) => {
    let name = req.body.name;
    let email = req.body.email;
    let store = await Store.findOneByEmail(email);
    if(name === store.name && email === store.email)  {
        let emailSubject = '店家密碼取回';
        let emailContent = `<h2>店家帳號:${name}</h2> <h3>店家密碼:${store.password}</h3>`
        let toEmail = 'bess_2500@yahoo.com.tw'
        emailController.send2(toEmail,emailSubject,emailContent);
        res.send('password has been sent to "' + email + '".');
    }else  {
        console.log('getPassword');
        res.send('email dosen\'t exsist');
    }
};

const getStoreSchema = (req, res, next) => {
    console.log('getStoreSchema');
    res.json({status: 200, msg: Object.keys(StoreSchema.obj)});
};

const searchStores = async(req, res, next) => {
    let key = req.body.key;
    let currentExhibit = req.body.currentExhibit;
    let storesInfo = [];
    const stores = await Store.findByCurrentExhibition(currentExhibit).populate('queue');
    stores.forEach(function(store)  {
        if(store.name.includes(key))  {
            storesInfo.push({
                name:store.name,
                phone:store.phone,
                info:store.info,
                address:store.address,
                email:store.email,
                currentExhibit:store.currentExhibit,
                boothNo:store.boothNo,
                imgURL:store.imgURL,
                current:store.queue.current,
                total:store.queue.total
            });
        }  
        
    });
    console.log('searchStore');
    res.json({status:200, msg:storesInfo});
};

const updateStore = async(req, res, next) => {
    let email = req.body.email;
    let postKeyValue = req.body.postKeyValue;
    let input = req.body.input;
    let store = await Store.findOneByEmail(email);
    if(store === null) {
        res.json({status:1, msg:'店家不存在'});
        return;
    }
    let newPhone = Checker.isfilled(req.body.phone) ? store.phone.phone:req.body.phone;
    let newInfo = Checker.isfilled(req.body.info) ? store.info:req.body.info;
    let newAddress = Checker.isfilled(req.body.address)? store.address:req.body.address;
    let newEmail = Checker.isfilled(req.body.email) ? store.eamil:req.body.email;
    let newCurrentExhibit = Checker.isfilled(req.body.currentExhibit) ? store.eamil:req.body.currentExhibit;
    let newName = Checker.isfilled(req.body.name)? store.name:req.body.name;
    let newPassword = Checker.isfilled(req.body.password)? store.password:req.body.password;
    let boothNo = Checker.isfilled(req.body.boothNo) ? store.boothNo:req.body.boothNo;
    let imgURL = Checker.isfilled(req.body.imgURL) ? store.imgURL:req.body.imgURL;
    
    //全部更新updateMany.({}空格代表全部條件都選,{$set:{object}}要替換的內容)  加了$set 代表只替換相對的資訊 原本其他資訊保留不刪除
    // await Store.updateOne({name:req.body.storeName}, { $set: { phone: {cellphone:cell,fixphone:fix},email:email }});
    Store.updateOne({email: email}, {
        [postKeyValue]: input
    }, function(error, store2)  {
        if(error)  {
            console.log('updateStore error:' + error);
        }else  {
            if(store2)  {
                console.log(store2.name + ' has been updated');
                res.json({status: 200, msg: store2});
            }
        }
    });
    
};

const getStore = async(req, res, next) => {
    //post/get key value storeName
    let name = req.query.name;
    let store  = await Store.findOneByName(name);
    console.log('getStore');
    res.json({status: 200, msg: store});
};

const getAllStores = async(req, res, next) => {
    let stores = await Store.findAllStores();
    console.log('getAllStores');
    res.json({status: 200, msg: stores});
};

const getQueueInfo = async(req, res, next) => {
    let currentExhibit = req.query.name;
    let stores = await Store.find({currentExhibit:currentExhibit}).populate({
        path: 'queue',
        populate: {
          path: 'visitor', 
        }
      })
    let infos = [];
    //讓vt初始化為8-18的數字組
    const openTime = 8;
    const closeTime = 18;
    for(let i = 0; i < stores.length; i++){
        let obj = {};
        obj.name = stores[i].name;
        obj.email = stores[i].email;
        let vt =[];
        for(let j = openTime; j <= closeTime; j++){
            vt[j-openTime] = {時間:j, 人數:0};
        }
        for(let j = 0; j < stores[i].visitorTime.length; j++){
            let key = new Date(stores[i].visitorTime[j]).getHours();
            // console.log(key)//這裡的key是local hour
            if(key >= openTime && key <= closeTime)  {
                vt[key-openTime]['人數']++;
            }
        }
        obj.timeAndVisitor = vt;
        infos.push(obj);
    }
    console.log('getQueueInfo');
    res.json({status: 200, msg: infos});  
};

const getQueueInfo2 = async(req, res, next) => {
    let currentExhibit = req.query.name;
    let stores = await Store.find({currentExhibit:currentExhibit}).populate({
        path: 'queue',
        populate: {
            path: 'visitor', 
        }
      })
    let infos = [];
    //   required info schema:
    //   [{name:name,email:email,inlineNum:inlineNum, totalQueueNum: totalQueueNum},{},{}......]
    let obj = {};
    stores.forEach(function(store, index, arr)  {
        obj = {};
        obj.name = store.name;
        obj.email = store.email;
        let total = store.queue.total;
        let currentNum = store.queue.current;
        obj.inlineNum = total-currentNum;
        obj.totalQueueNum = total;
        infos.push(obj);
    })
    console.log('getQueueInfo2');
    res.json({status:200,msg:infos});  
};

const clearStoreExhibit = async(req, res, next) => {
    await Store.updateMany({}, {$set: {currentExhibit: ''}});
    console.log('clear stores exhibition info');
    res.send('clear stores exhibition info');
};

const remove = async(req, res, next) => {
    let email = req.body.email;
    Store.deleteOne({email: email}, function(err, result){
        if(err)  {
            console.log(err);
        }else  {
            console.log('store removed');
            res.json({status: 200,msg: result});
        }
    })
};

//0728：第一次下載app的時候，以及登出的時候，更新資料
const initialBoothDataByServer = async(req, res, next) => {
    let boothId = req.decoded.boothId;
    let booth = await Store.findOne().byBoothId(boothId);
    if(!booth)  {
        res.json({status: 404, serverMsg: '404, not found, find booth data failure.', clientMsg: '展覽資料載入失敗，請重新登入'});
        return;
    }
    let exhibition = await Exhibition.findOne().byName(booth.currentExhibit);
    if(!exhibition)  {
        res.json({status: 404, serverMsg: '404, not found, find exhibition data failure.', clientMsg: '展覽資料載入失敗，請重新登入'});
        return;
    }
    let date = getFormatDate(new Date(exhibition.start.getTime()), new Date(exhibition.end.getTime()));
    let time = getFormatTime(new Date(exhibition.start.getTime()),new Date(exhibition.end.getTime()));
    res.json({status: 200, exhibition: exhibition, booth: booth, date: date, time: time, serverMsg: '200, ok, find booth data success.', clientMsg: '展覽資料載入成功'});
};

//0728：更新攤位描述
const updateBoothInfo = async(req, res, next) => {
    let boothId = req.decoded.boothId;
    let info = req.body.info;
    if(info.trim().length == 0)  {
        info = "尚未編輯";
    }
    let booth = await Store.findOne().byBoothId(boothId);
    if(!booth)  {
        res.json({status: 404, serverMsg: '404, not found, find booth by _id failure.', clientMsg: '攤位描述更新失敗'});
        return;
    }
    Store.findOneAndUpdate({_id: boothId}, {$set:{info: info}}, {new: true}, function(err, booth)  {
        if(err || !booth)  {
            res.json({status: 400, serverMsg: '400, bad request, booth info update failed.', clientMsg: '攤位描述更新失敗'});
            return;
        }
        res.json({status: 200, booth: booth, serverMsg: '200, ok, booth info update success.', clientMsg: '攤位描述更新成功'});
    });
}

//0729：取得Format好的日期
const getFormatDate = (dateStart, dateEnd) => {
    let dayStart;
    let dayEnd;
    // return dateStart.getFullYear() + '/' + (dateStart.getMonth() + 1) + '/' + dateStart.getDate() + getFormatDay(dayStart.getDay())
    //         + ' - ' + dateEnd.getFullYear() + '/' + (dateEnd.getMonth() + 1) + '/' + dateEnd.getDate() + getFormatDay(dayEnd.getDay());
    return (dateStart.getFullYear() + '/' + (dateStart.getMonth() + 1) + '/' + dateStart.getDate()
    + ' - ' + dateEnd.getFullYear() + '/' + (dateEnd.getMonth() + 1) + '/' + dateEnd.getDate());
};

//0729：取得Format好的天
const getFormatDay = (date) => {
    if(date == 0)  {
        return '(日)';
    }else if(date == 1)  {
        return '(一)';
    }else if(date == 2)  {
        return '(二)';
    }else if(date == 3)  {
        return '(三)';
    }else if(date == 4)  {
        return '(四)';
    }else if(date == 5)  {
        return '(五)';
    }else if(date == 6)  {
        return '(六)';
    }
}

//0729：取得Format好的時間
const getFormatTime = (dateStart, dateEnd) => {
    let dateStartFormat, dateEndFormat;
    if(dateStart.getMinutes() == 0)  {
        dateStartFormat = '00';
    }else  {
        dateStartFormat = dateStart.getMinutes();
    }
    if(dateEnd.getMinutes() == 0)  {
        dateEndFormat = '00';
    }else  {
        dateEndFormat = dateEnd.getMinutes();
    }
    return dateStart.getHours() + ':' + dateStartFormat + ' - ' + dateEnd.getHours() + ':' + dateEndFormat;
};

//0729：在登入狀態下更換email
const changeEmail = async(req, res, next) => {
    let boothId = req.decoded.boothId;
    let email = req.body.newMail;
    let password = req.body.confirmPsw;
    if(email.trim().length == 0 && password.trim().length == 0)  {
        res.json({status: 400, serverMsg: '400, bad request, lack new email and check password.', clientMsg: '請輸入新信箱與原密碼'});
        return;
    }
    if(email.trim().length == 0 && password.trim().length != 0)  {
        res.json({status: 400, serverMsg: '400, bad request, lack new email.', clientMsg: '請輸入新信箱'});
        return;
    }
    if(email.trim().length != 0 && password.trim().length == 0)  {
        res.json({status: 400, serverMsg: '400, bad request, lack check password.', clientMsg: '請輸入原密碼'});
        return;
    }
    let booth = await Store.findOne().byIdPsw(boothId, password);
    if(!booth)  {
        res.json({status: 400, serverMsg: '400, bad request, wrong check password.', clientMsg: '密碼錯誤'});
        return;
    }
    Store.findOneAndUpdate({_id: boothId}, {$set:{email: email}}, {new: true}, function(err, booth)  {
        if(err || !booth)  {
            res.json({status: 404, serverMsg: '404, not found, find booth by _id failed.', clientMsg: '連線異常，請重新嘗試'});
            return;
        }
        console.log(booth);
        res.json({status: 200, booth: booth, email: email, serverMsg: '200, ok, change email success.', clientMsg: '信箱更換成功'});
     });
};

//0729：在登入狀態下更換密碼
const changePassword = async(req, res, next) => {
    let boothId = req.decoded.boothId;
    let oldPsw = req.body.oldPsw;
    let newPsw = req.body.newPsw;
    let password = req.body.checkPsw;
    let booth = await Store.findOne().byIdPsw(boothId, oldPsw);
    if(!booth)  {
        res.json({status: 400, serverMsg: '400, bad request, wrong old password.', clientMsg: '原密碼錯誤'});
        return;
    }
    if(newPsw.trim() != password.trim())  {
        res.json({status: 400, serverMsg: '400, bad request, password not same.', clientMsg: '新密碼不相符'});
        return;
    }
    if(password.trim().length < 6) {
        res.json({status: 400, serverMsg: '400, bad request, password digits can not less than 6.', clientMsg: '新密碼不得少於6位數'});
        return;
    }
    if(password.trim().length > 20) {
        res.json({status: 400, serverMsg: '400, bad request, password digits can not more than 20.', clientMsg: '新密碼不得大於20位數'});
        return;
    }
    if(boothController.checkPswFormatValid(password.trim())) {
        res.json({status: 400, serverMsg: '400, bad request, password contains invalid symbol.', clientMsg: '新密碼僅可由英文與數字組成'});
        return;
    }
    if(boothController.checkIfPswContainEnglishAndNum(password.trim())) {
        res.json({status: 400, serverMsg: '400, bad request, password contains english and num.', clientMsg: '新密碼需同時包含英文與數字'});
        return;
    }
    Store.findOneAndUpdate({_id: boothId}, {$set:{password: password}}, {new: true}, function(err, booth)  {
        if(err || !booth)  {
            res.json({status: 404, serverMsg: '404, not found, find booth by _id failed.', clientMsg: '連線異常，請重新嘗試'});
            return;
        }
        console.log(booth);
        res.json({status: 200, booth: booth, password: password, serverMsg: '200, ok, change password success.', clientMsg: '密碼重設成功'});
    });
};

//0729：傳送Feedback到我們的信箱
const sendFeedback = async(req, res, next) => {
    let boothId = req.decoded.boothId;
    let type1 = req.body.type1;
    let type2 = req.body.type2;
    let type3 = req.body.type3;
    let type4 = req.body.type4;
    let feedBackContent = req.body.feedBackContent;
    let typeArr = [];
    if(type1.trim().length != 0)  {
        typeArr.push(type1);  
    }
    if(type2.trim().length != 0)  {
        typeArr.push(type2);  
    }
    if(type3.trim().length != 0)  {
        typeArr.push(type3);  
    }
    if(type4.trim().length != 0)  {
        typeArr.push(type4);  
    }
    let booth = await Store.findOne().byId(boothId);
    if(!booth)  {
        res.json({status: 404, serverMsg: '404, not found, find booth by _id failure.', clientMsg: '連線異常，請重新嘗試'});
        return;
    }
    let allType = '';
    for(let i = 0; i < typeArr.length; i++)  {
        allType += (i + 1) + '.' + typeArr[i] + '  ';
    }
    let to = booth.email;
    let subject = 'Lead Long Line展覽端用戶意見反饋';
    let text = '意見類型：' + allType + '\n\n' + '意見回饋內容：' + feedBackContent + '\n\n' + '發送意見回饋信之展位資料：' + booth;
    emailController.sendFeedbackEmail(req, res, next, to, subject, text, booth);
}

module.exports = {
    create, 
    getPassword,
    getStoreSchema,
    searchStores,
    updateStore,
    getStore,
    getAllStores,
    getQueueInfo,
    getQueueInfo2,
    clearStoreExhibit,
    remove,
    initialBoothDataByServer, //0728：第一次下載app的時候，以及登出的時候，更新資料
    updateBoothInfo, //0728：更新攤位描述
    changeEmail, //0729：在登入狀態下更換信箱
    changePassword, //0729：在登入狀態下更換密碼
    sendFeedback //0729：傳送Feedback到我們的信箱
}