const QueueWay = require('../utils/queueWay');
const queue = new QueueWay();
const Store = require('../models/store');
var StoreSchema = require('mongoose').model('Store').schema;
const Exhibit = require('../models/exhibition');
const OldExhibit = require('../models/old_exhibition');
const mongoose = require('mongoose');

const a = (req,res)=>{
    res.send(new Date());
}
const b =(req,res)=>{
    let name = req.body.name;
    let password = req.body.password;
    res.json({status:1, msg:{name:name,password:'1234'}});
    return;
}
const c =(req,res)=>{
    Exhibit.find(function(err, docs) {
            docs.forEach(async function(doc){
                // doc._id = mongoose.Types.ObjectId();
                // doc.isNew = true; //<--------------------IMPORTANT
                // await doc.save();
                var newdoc = new OldExhibit(doc);
                newdoc._id = mongoose.Types.ObjectId();
                newdoc.isNew = true;
                console.log(newdoc);
                await newdoc.save();
            })
            res.send('clone done')
        }
    );
}
const d = (req,res)=>{
    //找到每間攤位展期時間是否超過
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
                        console.log(exStart > new Date(2018,01,01));//true
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