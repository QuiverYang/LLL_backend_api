const QueueWay = require('../utils/queueWay');
const queue = new QueueWay();
const Store = require('../models/store');
var StoreSchema = require('mongoose').model('Store').schema;
const Exhibit = require('../models/exhibition');

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
    let name = req.body.name
    console.log(name);
    res.send(name);
}
const d = (req,res)=>{
    Store.find(function(err,stores){
        if(err){
            console.log(err);
            res.send(error);
        }else{
            if(stores !== null){
                let exName = stores[0].currentExhibit;
                console.log('currentExhibit: '+exName);
                Exhibit.findOne({name:exName},function(err,ex){
                    if(err){
                        console.log('exhibit error');
                    }else{
                        let exStart = ex.start;
                        console.log(exStart > new Date(2018,01,01));
                        res.send(exStart)
                    }
                })
            }
        }
    })
    
}
module.exports = {
    a,
    b,
    c,
    d
}