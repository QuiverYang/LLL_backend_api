const QueueModel = require('../models/queueModel');
const Queue = require('../utils/queueWay');
const User = require('../models/user');
const Store = require('../models/store');


const create = (req,res)=>{

}

const initAllStores = async (req,res)=>{
    await Store.updateMany({},{$set:{currentExhibit:''}});
    // let stores = await Store.find();
    // console.log(stores);
    res.send('currentExhibit of stores has been initialized to nothing');
}

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
    let user = await User.findByName(req.body.firstName,req.body.lastName);
    console.log(user);
    if(user == null){
        //此處應修改為新建立一個user給他然後加入
        res.json({status:400,msg:'can not add visitor who doesnt exsist'});
        return;
    }
    await Store.updateOne({name:req.body.storeName}, { $push: 
        { visitor: user }
    });

    let store = await Store.findOne({name:req.body.storeName}).populate('visitor');
    console.log(store.visitor);
    res.json({status:-1,msg:store});
}
const test = (req,res)=>{
    res.send('queue test');
}

const deleteAll = async (req,res)=>{
    await QueueModel.deleteMany({});
    res.send('deleted all queue');
}

module.exports = {
    addVisitor,
    create,
    initAllStores,
    test,
    deleteAll,
    setStoresExihibit
}