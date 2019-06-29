const Store = require('../models/store');
const Checker = require('../utils/checker');
const User = require('../models/user')

const create = async (req, res)=>{
    let storeName = req.body.storeName;
    let cell = req.body.cellphone;
    let fix = req.body.fixphone;
    let info = req.body.info;
    let address = req.body.address;
    let open = req.body.open;
    let close = req.body.close;
    let email = req.body.email

    // let user2 = await User.findByName(req.body.firstName,req.body.lastName);
    // console.log(user2);
    // if(user2 == null){
    //     res.json({status:400,msg:'can not add visitor who doesnt exsist'});
    //     return;
    // }
    
    if(storeName === undefined||
        cell === undefined||
        fix === undefined||
        info === undefined||
        address === undefined||
        open === undefined||
        close === undefined||
        email === undefined){
            res.json({status:-1,msg:"post empty store information"});
            return;
        }

    let store = new Store({
        name: storeName,
        phone: {
            cellphone: cell,
            fixphone:fix
        },
        info: info,
        address:address,
        openingTime:{
            open:open,
            close:close
        },
        email:email
    });

    //Model.create({object}) ->可直接創造並儲存
    // Store.create({
    //     name: storeName,
    //     phone: {
    //         cellphone: cell,
    //         fixphone:fix
    //     },
    //     info: info,
    //     address:address,
    //     openingTime:{
    //         open:open,
    //         close:close
    //     }
    // }).then(()=>{
    //     res.json({status:1, msg:store});
    // })

    store.save().then(()=>{
        res.json({status:1, msg:store});
    })
}

const getStore = async(req,res)=>{
    //post/get key value storeName
    let storeName = req.query.storeName;
    let store  = await Store.findOneByName(storeName);
    res.json({status:-1,msg:store});
}

const getAllStores = async function (req,res){
    let stores = await Store.findAllStores();
    res.json({status:-1, msg:stores});
}

const updateStore = async (req,res)=>{
    let storeName = req.body.storeName;
    let store = await Store.findOneByName(storeName);
    if(store === null){
        res.json({status:1, msg:'店家不存在'});
        return;
    }
    let cell = Checker.isfilled(req.body.cellphone) ? store.phone.cellphone:req.body.cellphone;
    let fix = Checker.isfilled(req.body.fixphone) ? store.phone.fixphone:req.body.fixphone;
    let info = Checker.isfilled(req.body.info) ? store.info:req.body.info;
    let address = Checker.isfilled(req.body.address)? store.address:req.body.address;
    let open = Checker.isfilled(req.body.open) ? store.openingTime.open:req.body.open;
    let close = Checker.isfilled(req.body.close) ? store.openingTime.close:req.body.close;
    let email = Checker.isfilled(req.body.email) ? store.eamil:req.body.email;

    
    //全部更新updateMany.({}空格代表全部條件都選,{$set:{object}}要替換的內容)  加了$set 代表只替換相對的資訊 原本其他資訊保留不刪除
    console.log(req.body.storeName);
    // await Store.updateOne({name:req.body.storeName}, { $set: 
    //     { phone: {cellphone:cell,fixphone:fix},email:email }
    //  });
     await Store.updateOne({name:req.body.storeName},{
        name: storeName,
        phone: {
            cellphone: cell,
            fixphone:fix
        },
        info: info,
        address:address,
        openingTime:{
            open:open,
            close:close
        },
        email:email
     })
    store = await Store.findOneByName(storeName);
    res.json({status:-1,msg:store});
}

const getPassword = async (req,res)=>{
    let name = req.body.storeName;
    let email = req.body.email;
    let store = await Store.findOneByEmail(email);
    if(name === store.name && email === store.email){
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