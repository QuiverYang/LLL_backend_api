const Store = require('../models/store');
const Checker = require('../utils/checker');
const User = require('../models/user')
const Queue = require('../models/queue');
const emailController = require('../controllers/emailController');

const create = async (req, res)=>{
    let name = req.body.name;
    let phone = req.body.phone;
    let info = req.body.info;
    let address = req.body.address;
    let email = req.body.email
    let password = req.body.password;
    let currentExhibit = req.body.currentExhibit;
    let boothNo = req.body.boothNo;
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
        currentExhibit:currentExhibit,
        password:password,
        boothNo:boothNo,
        queue:queue
    });

    store.save().then(()=>{
        res.json({status:200, msg:store});
    })
}

const getStore = async(req,res)=>{
    //post/get key value storeName
    let name = req.query.name;
    let store  = await Store.findOneByName(name);
    res.json({status:200,msg:store});
}

const getAllStores = async function (req,res){
    let stores = await Store.findAllStores();
    res.json({status:200, msg:stores});
}

const updateStore = async (req,res)=>{
    let email = req.body.email;
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
    Store.updateOne({email:req.body.email},{
        name: newName,
        phone: newPhone,
        info: newInfo,
        address:newAddress,
        email:newEmail,
        currentExhibit:newCurrentExhibit,
        password:newPassword,
        boothNo :boothNo,
        imgURL:imgURL
     },function(error, store2){
        if(error){
            console.log('updateStore error:'+error)
        }else{
            if(store2){
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
        res.send('email dosen\'t exsist');
    }
}

const clearStoreExhibit = async (req,res)=>{
    await Store.updateMany({},{$set:{currentExhibit:''}});
    res.send('clear stores exhibition info');
}

module.exports = {
    create,
    getStore,
    updateStore,
    getAllStores,
    getPassword,
    clearStoreExhibit
}