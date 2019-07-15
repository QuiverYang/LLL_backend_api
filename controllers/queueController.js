const Queue = require('../models/queue');
const QueueWay = require('../utils/queueWay');
const User = require('../models/user');
const Store = require('../models/store');

//先設定好店家的currentExhibition 然後用此參數去尋找這次有參加該展的廠商
//創造出許多店家
const create = async (req,res)=>{
    const currentExhibit = req.body.currentExhibit;
    if(currentExhibit === undefined){
        res.json({status:400, msg:'currentExhibit hasn\'t been inputed'});
        return;
    }
    const stores = await Store.findByCurrentExhibition(currentExhibit);
    let storeNames = '';
    for(let i = 0; i < stores.length; i++){
        storeNames += stores[i].name +"\n";
        await Queue.create({
            exhibitionName:currentExhibit,
            storeName:stores[i].name,
            current : 0,
            total : 0,
            visitor:[]
        });
    }
    res.json({status:400,msg:storeNames})
}

const setVisitorToEmpty = async (req,res)=>{
    await Store.updateMany({},{$set:{visitor:[]}});
    res.json({status:200,msg:'cleared all visitors'})
}

const resetCurrentExhibit = async (req,res)=>{
    await Store.updateMany({},{$set:{currentExhibit:''}});
    // let stores = await Store.find();
    // console.log(stores);
    res.send('currentExhibit of stores has been initialized to nothing');
}
//輸入每個店家名字以及展覽名稱 把每個店家的cuccentExhibit變成展覽名稱
const setStoresExihibit= async (req,res)=>{
    //body的key是name
    const names = req.body.name;
    const currentExhibit = req.body.currentExhibit;
    if(names === undefined||currentExhibit === undefined){
        res.json({status:400, msg:'names or currentExhibit hasn\'t been inputed'});
        return;
    }
    if(Array.isArray(names)){
        for(let i = 0; i < names.length; i++){
            await Store.updateOne({name:names[i]},{$set:{currentExhibit:currentExhibit}});
        }
    }else{
        await Store.updateOne({name:names},{$set:{currentExhibit:currentExhibit}});
    }


    res.send('currentExhibit of stores has been changed to ' + currentExhibit);
}



const addVisitor = async(req,res)=>{
    const userEmail = req.body.userEmail;
    const storeEmail = req.body.storeEmail;
    if(userEmail === undefined|| storeEmail === undefined){
        res.json({status:400, msg:'input infomation missing'});
        return;
    }
    const store = await Store.findOne({email:storeEmail});
    if(store == null){
        //此處應修改為新建立一個user給他然後加入 depends on infomation in req.body
        res.json({status:400,msg:'invalid store Email'});
        return;
    }
    const exhibitor = await Queue.findOne({storeName:store.name});
    if(exhibitor == null){
        res.json({status:400,msg:'invalid exhibitor'});
        return;
    }
    let user = await User.findOneByEmail(userEmail);
    if(user == null){
        //此處應修改為新建立一個user給他然後加入 depends on infomation in req.body
        res.json({status:400,msg:'invalid user email'});
        return;
    }
    console.log(exhibitor.storeName);
    Queue.updateOne({storeName:exhibitor.storeName},{$push:{ visitor: user }, $set:{total:Number(exhibitor.total)+1} },function(error, result){
        if(error){
            console.log(error)
        }else{
            // userController.addStore(userEmail);
            res.json({status:200,msg:result});
        }
    });

    
}
const test = (req,res)=>{
    res.send('queue test');
}

const deleteAllQueue = async (req,res)=>{
    await Queue.deleteMany({});
    res.send('deleted all queue');
}

module.exports = {
    addVisitor,
    create,
    setVisitorToEmpty,
    test,
    deleteAllQueue,
    setStoresExihibit,
    resetCurrentExhibit,
}