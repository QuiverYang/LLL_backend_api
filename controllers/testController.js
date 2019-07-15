const QueueWay = require('../utils/queueWay');
const queue = new QueueWay();
const Store = require('../models/store');
var StoreSchema = require('mongoose').model('Store').schema;

const a = (req,res)=>{
    queue.enqueue('test1');
    queue.enqueue('test2');
    console.log(queue.size());
    let bb = queue.size();
    res.send(bb+'');
}
const b =(req,res)=>{
    let name = req.body.name;
    let password = req.body.password;
    res.json({status:1, msg:{name:name,password:'1234'}});
    return;
}
const c =(req,res)=>{
    res.send('test c')
}
const d = async (req,res)=>{
    console.log(Object.keys(StoreSchema.obj));
    res.send(Object.keys(StoreSchema.obj));
}
module.exports = {
    a,
    b,
    c,
    d
}