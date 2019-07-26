const Store = require('../models/store');
const Checker = require('../utils/checker');
const User = require('../models/user')
const Queue = require('../models/queue');
const emailController = require('../controllers/emailController');
const StoreSchema = require('mongoose').model('Store').schema;
const Message = require('../models/message');
const Exhibition = require('../models/exhibition');


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
                        res.json({status:200,msg:'update successful'});
                        console.log('addPost');
                    }
                })
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
    //   [{name:name,email:email,boothNo:boothNo,inlineNum:inlineNum, totalQueueNum: totalQueueNum},{},{}......]
    let obj = {};
    stores.forEach(function(store,index,arr){
        obj={}
        obj.name = store.name;
        obj.email = store.email;
        obj.boothNo = store.boothNo;
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
    getQueueInfo2,
    addPost,
}