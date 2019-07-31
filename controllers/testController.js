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

const a = (req,res)=>{
    let ISODate = new Date();
    let temp = ISODate.setHours(ISODate.getHours()+20);
    res.json({time:ISODate});
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
const createUser =  async (req, res, next)=>{
    let exhibitionName = req.query.exhibitionName
    if(exhibitionName === undefined){
        console.log('currentExhibit hasn\'t been inputed');
        return;
    }
    let stores = await Store.findByCurrentExhibition(exhibitionName);
    
    for(let i=0;i<100;i++){
        let a = 'a'+i;
        let name = a;
        let email = a+'@gmail.com';
        
        let user = new User({
            name: name,
            email:email,
            auth:true
        });
        user.save().then(() =>{
            console.log('create success');
        } );

        let r = Math.floor(Math.random()*stores.length)
        let store = stores[r];
        let storeEmail = stores[r].email;
        let myNum = r;
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
                        let hour = Math.floor(Math.random()*11+8)
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
module.exports = {
    a,
    b,
    c,
    d,
    createUser
}