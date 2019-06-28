const QueueModel = require('../models/queueModel');
const Queue = require('../utils/queueWay')

const create = (req,res)=>{

}

const initAllStores = ()=>{

}

const addVisitor = async(req,res)=>{
    let user = await User.findByName(req.body.firstName,req.body.lastName);
    console.log(user);
    if(user == null){
        res.json({status:400,msg:'can not add visitor who doesnt exsist'});
        return;
    }
    await Store.updateOne({name:req.body.storeName}, { $push: 
        { visitor: user }
    });
    let store = await Store.findOne({name:req.body.storeName}).populate('visitor');
    console.log(store.visitor);
    res.json({status:-1,msg:'store'});
}
const test = (req,res)=>{
    res.send('queue test');
}

module.exports = {
    addVisitor,
    create,
    initAllStores,
    test
}