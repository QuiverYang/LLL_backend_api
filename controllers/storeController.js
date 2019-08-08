const Store = require('../models/store');
const Checker = require('../utils/checker');
const User = require('../models/user')
const Queue = require('../models/queue');
const emailController = require('../controllers/emailController');
const StoreSchema = require('mongoose').model('Store').schema;
const Message = require('../models/message');
const Exhibition = require('../models/exhibition');
const History = require('../models/history');
const boothController = require('./boothController');
const Userqueue = require('../models/userqueue');


const create = async (req, res)=>{
    let name = req.body.name;
    let phone = req.body.phone;
    let info = req.body.info;
    let address = req.body.address;
    let email = req.body.email
    let password = req.body.password;
    let currentExhibit = req.body.currentExhibit;
    let boothNo = req.body.boothNo;
    let postAuth = req.body.postAuth;
    let queue = await Queue.create({
        exhibitionName:currentExhibit,
        storeName : name,
        current : 0,
        total: 0,
        visitor: []
    })
    //因為model裡面有設定預設值 所以undefined的值 可以為'暫未提供'
    let store = new Store({
        name: name,
        phone: phone,
        info: info,
        address:address,
        email:email,
        postAuth:postAuth,
        currentExhibit:currentExhibit,
        password:password,
        boothNo:boothNo,
        queue:queue,
    });

    store.save().then(()=>{
        console.log('store created')
        res.json({status:200, msg:store});
    })
}

const getStore = async(req,res)=>{
    //post/get key value storeName
    let name = req.query.name;
    let store  = await Store.findOneByName(name);
    console.log('getStore')
    res.json({status:200,msg:store});
}

const getAllStores = async function (req,res){
    let stores = await Store.findAllStores();
    console.log('getAllStores')
    res.json({status:200, msg:stores});
}

const searchStores = async function (req,res){
    let key = req.body.key;
    let currentExhibit = req.body.currentExhibit;
    let storesInfo = [];
    const stores = await Store.findByCurrentExhibition(currentExhibit).populate('queue');
    stores.forEach(function(store){
        if(store.name.includes(key)){
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
            })
        }  
        
    })
    console.log('searchStore')
    res.json({status:200, msg:storesInfo});
}

const updateStore = async (req,res)=>{
    let email = req.body.email;
    let postKeyValue = req.body.postKeyValue;
    let input = req.body.input;
    let store = await Store.findOneByEmail(email);
    if(store === null){
        res.json({status:1, msg:'店家不存在'});
        return;
    }
    Store.updateOne({email:email},{
        [postKeyValue]:input
     },function(error, store2){
        if(error){
            console.log('updateStore error:'+error)
        }else{
            if(store2){
                console.log(store2.name + ' has been updated')
                res.json({status:200,msg:store2});
            }
        }
     })
}

const addPost = async (req,res) =>{
    let email = req.body.email;
    let title = req.body.title;
    let content = req.body.content;
    Store.findOne({email:email, postAuth:{$gt:0}},async function(err,store){
        if(err){
            console.log('addPost error: '+err)
            return;
        }else{
            
            if(store === null){
                res.json({status:403, msg:'invalid email or postAuth'});
                return;
            }else {
                let post = await Message.create({title:title, content:content});
                console.log(post);
                Store.updateOne({email:email, postAuth:{$gt:0}},{$push:{post:post}, $inc:{postAuth:-1}}, function(err){
                    if(err){
                        res.json({status:404,msg:'404 server error'});
                        return;
                    }else{
                        Exhibition.updateOne({name:store.currentExhibit},{$push:{allPosts:post}},function(err){
                            if(err){
                                console.log('update exhibition '+store.currentExhibit+' error');
                                return;
                            }
                        });
                        res.json({status:200,msg:'update successful'});
                        console.log('addPost');
                    }
                });
                
            }
        }
    })
    // Store.findOneAndUpdate({email:email, postAuth:{$gt:0}},{$push:{post:post}, $inc:{postAuth:-1}},async function(err,store){
    //     if(err){
    //         console.log('addPost error '+ err);
    //         return;
    //     }else{
    //         let post = await Message.create({title:title, content:content});
    //         Exhibition.updateOne({name:store.currentExhibit},{$push:{allPosts:post}},function(err){
    //             if(err){
    //                 console.log('update exhibition '+store.currentExhibit+' error');
    //                 return;
    //             }
    //         })
    //         console.log('addPost from storeController and update exhibition allPosts');
    //         res.json({status:200,msg:store});
    //     }
    // })
}

const getPassword = async (req,res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let store = await Store.findOneByEmail(email);
    if(name === store.name && email === store.email){
        let emailSubject = '店家密碼取回';
        let emailContent = `<h2>店家帳號:${name}</h2> <h3>店家密碼:${store.password}</h3>`
        let toEmail = 'yangmenglin1119@gmail.com'
        emailController.send2(toEmail,emailSubject,emailContent);
        res.send('password has been sent to "'+email+'".')
    }else{
        console.log('getPassword')
        res.send('email dosen\'t exsist');
    }
}

const dumpOneStoreExhibit = async (req,res)=>{
    let email = req.body.email;
    let currentEx = req.body.exhibitionName;
    let date = req.body.date;
    Store.findOne({email:email},async function(err, stores){
        if(err){
            console.log('dumpOneStoreExhibit error');
            console.log(err);
            res.send('dumpOneStoreExhibit error')
            return
        }else if(stores){
                let historyVisitorTime = stores.visitorTime;
                let historyQueue = stores.queue;
                let historyPost = stores.post;
                // let TPEtime = new Date();
                let TPEtime = new Date(date).addHours(8);
                TPEtime.setHours(TPEtime.getHours()+8);
                let history = await History.create({
                    date: TPEtime,
                    historyVisitorTime:historyVisitorTime,
                    historyPost:historyPost,
                    historyQueue:historyQueue
                })
                stores.history.push(history);
                let queue = await Queue.create({
                    exhibitionName:currentEx,
                    storeName : stores.name,
                    current : 0,
                    total: 0,
                    visitor: []
                })
                stores.queue = queue;
                stores.visitorTime = [];
                stores.post=[];
                stores.save();
            console.log('dumpOneStoreExhibit');
            res.send('dump stores visitorTime, queue and post');
        }else{
            console.log('dumpOneStoreExhibit');
            res.send('invalid exhibitionName');
        }
    })
}

const dumpStoreExhibit = async (req,res)=>{
    let currentEx = req.body.exhibitionName;
    let date = req.body.date;
    var endDate = null;
    await Exhibition.findOne({name:currentEx},function(err, ex){
        if(err){
            console.log('dumpStoreExhibit error');
            return;
        }else if(ex){
            endDate = ex.end;
        }
    })
    if(date === undefined){
        // let TPEtime = new Date();
        // TPEtime.setHours(TPEtime.getHours()+8);
        date = new Date().addHours(-16); // 減一天
    }else{
        date = new Date(date).addHours(8);
    }
    Store.find({currentExhibit:currentEx},async function(err, stores){
        if(err){
            console.log('dumpStoreExhibit error');
            console.log(err);
            res.send('dumpStoreExhibit error')
            return
        }else if(stores){

            for(let i = 0; i < stores.length; i++){
                
                let historyVisitorTime = stores[i].visitorTime;
                let historyQueue = stores[i].queue;
                let historyPost = stores[i].post;
                let history = await History.create({
                    date: date,
                    historyVisitorTime:historyVisitorTime,
                    historyPost:historyPost,
                    historyQueue:historyQueue
                })
                if(stores[i].history === undefined){
                    stores[i].history = [];
                }
                stores[i].history.push(history);
                let queue = await Queue.create({
                    exhibitionName:currentEx,
                    storeName : stores.name,
                    current : 0,
                    total: 0,
                    visitor: []
                })
                stores[i].queue = queue;
                stores[i].visitorTime = [];
                stores[i].clientState = [];
                stores[i].callTime = [];
                if(date>=endDate){
                    stores[i].post=[];
                }

                stores[i].save();
            }
            await User.clearUserLine();
            console.log('dumpStoreExhibit');
            res.send('dump stores visitorTime, queue and post');
        }else{
            console.log('invalid dumpStoreExhibit');
            res.send('invalid exhibitionName');
        }
    })
}

const remove = async(req,res)=>{
    let email = req.body.email;
    
    Store.deleteOne({email:email},function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log('store removed')
            res.json({status:200,msg:result});
        }
    })
}

const getStoreSchema = (req,res)=>{
    console.log('getStoreSchema');
    res.json({status:200,msg:Object.keys(StoreSchema.obj)});
}

const getQueueInfo = async (req,res)=>{
    let date = new Date(req.query.date);
    let currentExhibit = req.query.name;
    let today = new Date();
    let sameDate = date.toDateString()===today.toDateString();
    console.log('same: '+sameDate);
    let stores = await Store.find({currentExhibit:currentExhibit})
    .populate({
        path: 'queue',
        populate: {
          path: 'visitor', 
        }
      })
    .populate({
        path:'history',
        populate:{
            path:'historyPost historyQueue'
        }
      })
    //   console.log(stores);
    let infos = [];
    //讓vt初始化為8-18的數字組
    const openTime = 8;
    const closeTime = 18;
    if(sameDate){
        for(let i = 0; i < stores.length; i++){
            let obj = {}
            let total = stores[i].queue.total;
            // console.log(i+" total"+total +" name: "+ stores[i].name)
            let currentNum = stores[i].queue.current;
            let vt =[];
            obj.name = stores[i].name;
            obj.email = stores[i].email;
            obj.boothNo = stores[i].boothNo;
            obj.inlineNum = total-currentNum;
            obj.totalQueueNum = total;
            //初始化timeAndVisitor格式
            for(let j = openTime; j <=closeTime; j++){
                vt[j-openTime]={時間:j,人數:0};
            }
            for(let j = 0; j < stores[i].visitorTime.length; j++){
                let key = stores[i].visitorTime[j].getHours();
                if(key>=openTime && key<=closeTime){
                    vt[key-openTime]['人數']++;
                }
            }
            let maxVisitTime = 0, temp = 0;
            vt.forEach(function(item){
                if(item['人數']>temp){
                    temp =item['人數'];
                    maxVisitTime = item['時間'];
                }
            })
            obj.maxVisitTime = maxVisitTime;
            obj.timeAndVisitor = vt;
            infos.push(obj);
        }
    }else{
        for(let i = 0; i < stores.length; i++){
            for(let j = 0; j < stores[i].history.length; j++){
                let obj ={};
                if(date.getDate()===stores[i].history[j].date.getDate()){
                    // console.log(stores[i].name);
                    // console.log('j: '+ j);
                    // console.log(stores[i].history[j]);
                    let total = stores[i].history[j].historyQueue.total;
                    let currentNum = stores[i].history[j].historyQueue.current;
                    let vt = [];
                    obj.name = stores[i].name;
                    obj.email = stores[i].email;
                    obj.boothNo = stores[i].boothNo;
                    obj.inlineNum = total-currentNum;
                    obj.totalQueueNum = total;
                    for(let k = openTime; k <=closeTime; k++){
                        vt[k-openTime]={時間:k,人數:0};
                    }
                    for(let k = 0; k < stores[i].history[j].historyVisitorTime.length; k++){
                        let key = new Date(stores[i].history[j].historyVisitorTime[k]).getHours();
                        // console.log(key)//這裡的key是local hour
                        if(key>=openTime && key<=closeTime){
                            vt[key-openTime]['人數']++;
                        }
                        if(stores[i].name == '大富翁天團'){
                            console.log(new Date(stores[i].history[j].historyVisitorTime[k]))
                        }
                    }
                    obj.timeAndVisitor = vt;
                    let maxVisitTime = 0, temp = 0;
                    vt.forEach(function(item){
                        if(item['人數']>temp){
                            temp =item['人數'];
                            maxVisitTime = item['時間'];
                        }
                    })
                    obj.maxVisitTime = maxVisitTime;
                    infos.push(obj);
                    break;
                }
            }
        }
    }
    console.log('getQueueInfo')
    res.json({status:200,msg:infos});  
    // res.json({status:200,msg:stores});  
}
const clearHistory = (req,res)=>{
    let name = req.body.exhibitionName;
    Store.updateMany({currentExhibit:name},{$set:{history:[]}},function(err){
        if(err){
            console.log(err);
            res.json({err:err});
            return;
        }
    });
    console.log('clearHistory');
    res.json('clearHistory')

    // Store.updateMany({currentExhibit:'電玩展'},{$pop:{history:1}},function(err){
    //     if(err){
    //         console.log(err);
    //         res.json({err:err});
    //         return;
    //     }
    // });
    // console.log('clearHistory');
    // res.json('clearHistory')
}


//0806：第一次下載app的時候，以及登出的時候，更新資料
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
    let queue = await Queue.findOne().byQueue(booth.queue);
    if(!queue)  {
        res.json({status: 404, booth: booth, serverMsg: '404, not found, find queue failure.', clientMsg: '展覽資料載入失敗，請重新登入'});
        return;
    }
    let date = getFormatDate(new Date(exhibition.start.getTime()), new Date(exhibition.end.getTime()));
    let time = getFormatTime(new Date(exhibition.start.getTime()),new Date(exhibition.end.getTime()));
    res.json({status: 200, exhibition: exhibition, booth: booth, queue: queue, date: date, time: time, serverMsg: '200, ok, find booth data success.', clientMsg: '展覽資料載入成功'});
};


//0806剛登入初始化clientArr
const initClientArr = async(req, res, next) => {
    let booth = await Store.findOne().byId(req.decoded.boothId);
    if(!booth)  {
        res.json({status: 404, serverMsg: '404, not found, find booth data failure.', clientMsg: '排隊資料載入失敗，請重新登入'});
        return;
    }
    let queue = await Queue.findOne().byQueue(booth.queue);
    if(!queue)  {
        res.json({status: 404, serverMsg: '404, not found, find queue failure.', clientMsg: '排隊資料載入失敗，請重新登入'});
        return;
    }
    let clientArr = [];
    for(let i = 0; i < queue.visitor.length; i++)  {
        let user = await User.findOne().byId(queue.visitor[i]);
        let state = booth.clientState[i];
        if(!user)  {
            clientArr.push({id: "已刪除", name: "已刪除", email: "已刪除", phone: "已刪除", gender: "已刪除", state: 2, time: "已刪除"});
        }
        clientArr.push({id: user._id, name: user.name, email: user.email, 
            phone: user.phone, gender: user.gender, state: state
            , time: getFormatCallTime(new Date(booth.visitorTime[i].getTime())), callTime: getFormatCallTime(new Date(booth.callTime[i].getTime()))});
    }
    res.json({status: 200, booth: booth, queue: queue, clientArr: clientArr, serverMsg: '200, ok, find clientArr data success.', clientMsg: '排隊資料載入成功'});
}


// const getFormatCallTime = (date) => {
//     return (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
//     + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
// };

//0806
const callClient = async(req, res, next) => {
    let booth = await Store.findOne().byId(req.decoded.boothId);
    if(!booth)  {
        res.json({status: 404, serverMsg: '404, not found, find booth data failure.', clientMsg: '連線異常，請重新嘗試'});
        return;
    }
    let queue = await Queue.findOne().byQueue(booth.queue);
    if(!queue)  {
        res.json({status: 404, booth: booth, serverMsg: '404, not found, find queue failure.', clientMsg: '找不到排隊資料，請重新嘗試'});
        return;
    }
    let callNum = req.body.callNum;
    let callTime = req.body.callTime;
    if(callNum > queue.total)  {
        res.json({status: 400, booth: booth, serverMsg: '400, bad request, call client failure.', clientMsg: '叫號順序不可大於當前排隊人數'});
        return;
    }
    Queue.findOneAndUpdate({_id: queue._id}, {$set:{current: callNum}}, {new: true}, function(err, queue)  {
        if(err || !queue)  {
            res.json({status: 400, booth: booth, queue: queue, serverMsg: '400, bad request, queue info update failed.', clientMsg: '排隊資料無法更新，請重新嘗試'});
            return;
        }
        //res.json({status: 200, booth: booth, queue: queue, serverMsg: '200, ok, call client success.', clientMsg: '叫號成功'});
    });
    Store.findOneAndUpdate({_id: booth.id}, {$set:{["callTime." + (req.body.callNum - 1)]: new Date(callTime)}}, {new: true}, function(err, boothTime)  {
        if(err || !boothTime)  {
            res.json({status: 400, booth: booth, queue: queue,  serverMsg: '400, bad request, booth info update failed.', clientMsg: '叫號時間無法更新，請重新嘗試'});
            return;
        }
        res.json({status: 200, booth: booth, queue: queue, serverMsg: '200, ok, call client success.', clientMsg: '叫號成功'});
    });
}

//0806：掃描加入排隊客戶
const scannerAdd = async(req, res, next) => {
    let booth = await Store.findOne().byId(req.decoded.boothId);
    if(!booth)  {
        res.json({status: 404, serverMsg: '404, not found, find booth data failure.', clientMsg: '連線異常，請重新嘗試'});
        return;
    }
    let queue = await Queue.findOne().byQueue(booth.queue);
    if(!queue)  {
        res.json({status: 404, serverMsg: '404, not found, find queue failure.', clientMsg: '找不到排隊資料，請重新嘗試'});
        return;
    }
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let gender = req.body.gender;
    let time = req.body.time;
    let state = req.body.state;
    let userQueue = new Userqueue({
        myNum: queue.total + 1,
        store: booth._id
    });
    let user = await User.findOne().byData(name, email, phone, gender);
    if(!user)  {
        res.json({status: 404, serverMsg: '404, not found, find user failure.', clientMsg: '找不到客戶資訊，無法加入排隊'});
        return;
    }
    userQueue.save().then(() => {
        User.findOneAndUpdate({_id: user.id}, {$push:{line: userQueue._id}}, {new: true}, function(err, user)  {
            if(err || !user)  {
                res.json({status: 400, booth: booth, queue: queue, user: user, userQueue: userQueue, serverMsg: '400, bad request, booth info update failed.', clientMsg: '無法加入排隊資料，請重新嘗試'});
                return;
            }
        })
    });
    Queue.findOneAndUpdate({_id: queue._id}, {$push:{visitor: user._id}, $set:{total: queue.visitor.length + 1}}, {new: true}, function(err, queue)  {
        if(err || !queue)  {
            res.json({status: 400, serverMsg: '400, bad request, booth info update failed.', clientMsg: '找不到排隊資料，請重新嘗試'});
            return;
        }
    });
    Store.findOneAndUpdate({_id: booth.id}, {$push:{visitorTime: new Date(time), clientState: state, callTime: new Date('1970-1-1 00:00:00')}}, {new: true}, function(err, boothTime)  {
        if(err || !boothTime)  {
            res.json({status: 400, booth: booth, queue: queue, user: user, userQueue: userQueue, serverMsg: '400, bad request, booth info update failed.', clientMsg: '排隊資料無法更新，請重新嘗試'});
            return;
        }
        res.json({status: 200, booth: booth, queue: queue, user: user, userQueue: userQueue, serverMsg: '200, ok, add inline success.', clientMsg: '加入排隊成功'});
    });
}

//0808：手動加入排隊客戶
const handAdd = async(req, res, next) => {
    let booth = await Store.findOne().byId(req.decoded.boothId);
    if(!booth)  {
        res.json({status: 404, serverMsg: '404, not found, find booth data failure.', clientMsg: '連線異常，請重新嘗試'});
        return;
    }
    let queue = await Queue.findOne().byQueue(booth.queue);
    if(!queue)  {
        res.json({status: 404, serverMsg: '404, not found, find queue failure.', clientMsg: '找不到排隊資料，請重新嘗試'});
        return;
    }
    //把掃描部分的查找會員改成建立一個假會員
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let gender = '訪客';
    let time = req.body.time;
    let state = req.body.state;
    let userQueue = new Userqueue({
        myNum: queue.total + 1,
        store: booth._id
    });
    let user = new User({
        name: name,
        email: email,
        phone: phone,
        gender: gender,
        auth: true,
        line: []
    });
    //建立一個假的userQueue跟user，裡面是我排的展位跟號碼。
    userQueue.save().then(user.save().then(() => {
        User.findOneAndUpdate({_id: user.id}, {$push:{line: userQueue._id}}, {new: true}, function(err, user)  {
            if(err || !user)  {
                res.json({status: 400, booth: booth, queue: queue, user: user, userQueue: userQueue, serverMsg: '400, bad request, booth info update failed.', clientMsg: '無法加入排隊資料，請重新嘗試'});
                return;
            }
        })
    }));
    Queue.findOneAndUpdate({_id: queue._id}, {$push:{visitor: user._id}, $set:{total: queue.visitor.length + 1}}, {new: true}, function(err, queue)  {
        if(err || !queue)  {
            res.json({status: 400, booth: booth, queue: queue, user: user, userQueue: userQueue, serverMsg: '400, bad request, booth info update failed.', clientMsg: '排隊資料無法更新，請重新嘗試'});
            return;
        }
    });
    Store.findOneAndUpdate({_id: booth.id}, {$push:{visitorTime: new Date(time), clientState: state, callTime: new Date('1970-1-1 00:00:00')}}, {new: true}, function(err, boothTIme)  {
        if(err || !boothTIme)  {
            res.json({status: 400, booth: booth, queue: queue, user: user, userQueue: userQueue, serverMsg: '400, bad request, booth info update failed.', clientMsg: '排隊資料無法更新，請重新嘗試'});
            return;
        }
        res.json({status: 200, booth: booth, queue: queue, user: user, userQueue: userQueue, serverMsg: '200, ok, add inline success.', clientMsg: '加入排隊成功'});
    });
}


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

//0806：取得Format好的日期
const getFormatCallTime = (date) => {
    // return (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    // + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
    return (date.getFullYear() + '-' + getFormatNum(date.getMonth() + 1) + '-' + getFormatNum(date.getDate())
    + ' ' + getFormatNum(date.getHours()) + ':' + getFormatNum(date.getMinutes()) + ':' + getFormatNum(date.getSeconds()));
};
//0729：取得Format好的日期
const getFormatDate = (dateStart, dateEnd) => {
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
    let dateStartFormat, dateEndForma
}


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
            console.log('changeEmail');
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
            console.log('changePassword')
            res.json({status: 404, serverMsg: '404, not found, find booth by _id failed.', clientMsg: '連線異常，請重新嘗試'});
            return;
        }
        console.log(booth);
        res.json({status: 200, booth: booth, password: password, serverMsg: '200, ok, change password success.', clientMsg: '密碼重設成功'});
    });
};
//0806：傳送Feedback到我們的信箱
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
    let to = 'leadlonglinebooth@gmail.com';
    let subject = 'Lead Long Line展覽端用戶意見反饋';
    let text = '意見類型：' + allType + '\n\n' + '意見回饋內容：' + feedBackContent + '\n\n' + '發送意見回饋信之展位資料：' + booth;
    emailController.sendFeedbackEmail(req, res, next, to, subject, text, booth);
}

//0806
const changeClientState = async(req, res, next) => {
    let booth = await Store.findOne().byId(req.decoded.boothId);
    if(!booth)  {
        res.json({status: 404, serverMsg: '404, not found, find booth data failure.', clientMsg: '連線異常，請重新嘗試'});
        return;
    }
    Store.findOneAndUpdate({_id: booth.id}, {$set:{["clientState." + req.body.index] : req.body.clientState}}, {new: true}, function(err, boothState)  {
        if(err || !boothState)  {
            res.json({status: 400, booth: booth, serverMsg: '400, bad request, booth info update failed.', clientMsg: '排隊資料無法更新，請重新嘗試'});
            return;
        }
        res.json({status: 200, booth: booth, serverMsg: '200, ok, add inline success.', clientMsg: '設定成功'});
    });
}
//0806
const getFormatNum = (num) => {
    if(num/10 < 1)  {
        return '0' + num.toString();
    }else  {
        return num.toString();
    }
}


module.exports = {
    create,
    getStore,
    updateStore,
    getAllStores,
    getPassword,
    dumpOneStoreExhibit,
    dumpStoreExhibit,
    searchStores,
    remove,
    getStoreSchema,
    getQueueInfo,
    addPost,
    clearHistory,
    initialBoothDataByServer,
    initClientArr,
    callClient,
    scannerAdd,
    handAdd,
    updateBoothInfo,
    changeEmail,
    changePassword,
    sendFeedback,
    changeClientState,
    getFormatNum
    
}