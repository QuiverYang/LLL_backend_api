const Store = require('../models/store');
const Checker = require('../utils/checker');
const User = require('../models/user')
const Queue = require('../models/queue');
const emailController = require('../controllers/emailController');
const StoreSchema = require('mongoose').model('Store').schema;


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
    // await Store.updateOne({name:req.body.storeName}, { $set: 
    //     { phone: {cellphone:cell,fixphone:fix},email:email }
    //  });
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

const clearStoreExhibit = async (req,res)=>{
    await Store.updateMany({},{$set:{currentExhibit:''}});
    console.log('clear stores exhibition info')
    res.send('clear stores exhibition info');
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
        let obj = {}
        obj.name = stores[i].name;
        obj.email = stores[i].email;
        let vt =[];
        for(let j = openTime; j <=closeTime; j++){
            vt[j-openTime]={時間:j,人數:0};
        }
        for(let j = 0; j < stores[i].visitorTime.length; j++){
            let key = new Date(stores[i].visitorTime[j]).getHours();
            // console.log(key)//這裡的key是local hour
            if(key>=openTime && key<=closeTime){
                vt[key-openTime]['人數']++;
            }
        }
        obj.timeAndVisitor = vt;
        infos.push(obj);
    }
    console.log('getQueueInfo')
    res.json({status:200,msg:infos});  
}

const getQueueInfo2 = async (req,res)=>{
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
    stores.forEach(function(store,index,arr){
        obj={}
        obj.name = store.name;
        obj.email = store.email;
        let total = store.queue.total;
        let currentNum = store.queue.current;
        obj.inlineNum = total-currentNum;
        obj.totalQueueNum = total;
        infos.push(obj);
    })
    console.log('getQueueInfo2')
    res.json({status:200,msg:infos});  
}

module.exports = {
    create,
    getStore,
    updateStore,
    getAllStores,
    getPassword,
    clearStoreExhibit,
    searchStores,
    remove,
    getStoreSchema,
    getQueueInfo,
    getQueueInfo2
}