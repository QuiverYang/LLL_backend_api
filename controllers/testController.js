const QueueWay = require('../utils/queueWay');
const queue = new QueueWay();
const Store = require('../models/store');
var StoreSchema = require('mongoose').model('Store').schema;
const Exhibit = require('../models/exhibition');
const User = require('../models/user'); 
const UserQueue = require('../models/userqueue');
const Queue = require('../models/queue');
const OldExhibit = require('../models/old_exhibition');
const mongoose = require('mongoose');
const History = require('../models/history');


const a = (req,res)=>{
    let date = new Date(req.query.date);
    let today = new Date();
    let same = date.getDate()===today.getDate();
    res.json({time:same});
}
const b =(req,res)=>{
    console.log(req.body.date);
    res.json({date:req.body.date})
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
const createUser =  async (req, res, next)=>{
    let exhibitionName = req.query.exhibitionName
    console.log(exhibitionName);
    if(exhibitionName === undefined){
        console.log('currentExhibit hasn\'t been inputed');
        return;
    }
    let stores = await Store.findByCurrentExhibition(exhibitionName);
    let users = [];
    
    for(let i=0;i<3;i++){
        let a = 'a'+i;
        let name = a;
        let email = a+'@gmail.com';
        
        let user = new User({
            name: name,
            email:email,
            auth:true
        });
        users.push(user);
        user.save().then(() =>{
            console.log('create success');
        } );
    }
    for(let i=0;i<100;i++){
        let r1 = Math.floor(Math.random()*users.length)
        let user = users[r1];
        let email = user.email;
        let r2 = Math.floor(Math.random()*stores.length)
        let store = stores[r2];
        let storeEmail = stores[r2].email;
        let myNum = 0;
        let userqueue = new UserQueue({
            myNum : myNum,
            store : store
        });
        await userqueue.save();
    
        User.updateOne({email:email},{$push:{ line : userqueue }},function(error, result){
            if(error){
                console.log(error)
            }else{
                Queue.updateOne({_id:store.queue._id},{$push:{visitor:user},$inc:{total:1}},function(error, result){
                    if(error){
                        console.log(error)
                    }else{
                        let date = '2019/7/30'
                        let hour = Math.floor(Math.random()*9+9)
                        let min = Math.floor(Math.random()*60)
                        let sec = Math.floor(Math.random()*60)
                        let time = date+' '+hour+':'+min+':'+sec
                        Store.updateOne({email:storeEmail},{$push:{visitorTime:time}},function(error){
                            if(error){
                                console.log(error);
                            }else{
                                console.log('user and store added queue data');
                            }
                        });
                        
                    }
                })
            }
            
        });
    }
    
    res.json({status:200, msg:'user and store added queue data'});
    // let password = req.body.password;
    // let birthday = req.body.birthday;
    // let phone = req.body.phone;
    // let gender = req.body.gender;
}

const dumpStoreExhibit = async (req,res)=>{
    let date = new Date(req.body.date);
    let currentEx = req.body.exhibitionName;
    Store.find({currentExhibit:currentEx},async function(err, stores){
        if(err){
            console.log('dumpStoreExhibit error');
            console.log(err);
            res.send('dumpStoreExhibit error')
            return
        }else if(stores){
            for(let i = 0; i < stores.length; i++){
                
                let historyVisitorTime = stores[i].visitorTime;
                let historyQueue = stores[i].queue;
                let historyPost = stores[i].post;
                
                let history = await History.create({
                    date: date,
                    historyVisitorTime:[historyVisitorTime],
                    historyPost:historyPost,
                    historyQueue:historyQueue
                })
                await history.save();
                if(stores[i].history === undefined){
                    stores[i].history = [];
                }
                stores[i].history.push(history);
                let queue = await Queue.create({
                    exhibitionName:currentEx,
                    storeName : stores.name,
                    current : 0,
                    total: 0,
                    visitor: []
                })
                stores[i].queue = queue;
                stores[i].visitorTime = [];
                stores[i].post=[];
                
                stores[i].save();
            }
            console.log('dumpStoreExhibit');
            res.send('dump stores visitorTime, queue and post');
        }else{
            console.log('invalid dumpStoreExhibit');
            res.send('invalid exhibitionName');
        }
    })
}

module.exports = {
    a,
    b,
    c,
    d,
    createUser,
    dumpStoreExhibit
}