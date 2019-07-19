const User = require('../models/user');  //拿到mongoose.model('User',userSchema)
const Store = require('../models/store');
const UserQueue = require('../models/userqueue'); 
const jwt = require('jsonwebtoken');
const config = require('../config');
const UserSchema = require('mongoose').model('User').schema;

const create =  async (req, res, next)=>{
    let password = req.body.password;
    let name = req.body.name;
    let birthday = req.body.birthday;
    let phone = req.body.phone;
    let gender = req.body.gender;
    let email = req.body.email;

    let tempUser = await User.findOneByEmail(email);
    if(tempUser != null){
        res.json({status:401,msg:'email has been registered'});
        return;
    }
    let user = new User({
        name: name,
        email:email,
        // id : await User.countDocuments()+1,
        birthday: birthday,
        gender: gender,
        phone: phone,
        password:password,
        auth:false
    });
    user.save().then(() =>{
        // let token = jwt.sign({email:email},config.jwtSalt,{
        //     expiresIn: 60*60*24//24hr
        // });
        res.json({status:200, msg:'create success'})
    } );
}


const test = (req,res)=>{
    res.send("test page");
}

//異步處理的寫法
const getUser = async (req,res,next)=>{
    let users = await User.findOneByName(req.query.name);
    res.json({status:200,msg:{users:users}});
}
const getLineByEmail = async (req,res,next)=>{
    let user = await User.findOneByEmail(req.body.email).populate({
        path: 'line', //对应user 设置字段
        populate: {
          path: 'store', //对应userqueue 设置字段
          populate: {
            path: 'queue', //对应userqueue 设置字段
          }
        }
      })
    let line = user.line;
    res.json({status:200,msg:line});
}

const getAllQueue = async (req,res,next)=>{
    let exhibitionName = req.body.exhibitionName;
    let email = req.body.email;
    if(exhibitionName === undefined){
        res.json({status:400,msg:'undefinded exhibitionName '})
    }
    // console.log(exhibitionName)
    const stores = await Store.find({currentExhibit:exhibitionName}).populate('queue');
    if(stores == null){
        res.json({status:400,msg:'invalid exhibitionName'})
    }
    // console.log(stores);
    let user = await User.findOneByEmail(email).populate({
        path: 'line', //对应user 设置字段
        populate: {
          path: 'store', //对应userqueue 设置字段
        }
      })
    let line = [];
    if(user!=null){
        line = user.line;
    }
    let storesInfo =[]
    stores.forEach(function(store){
        let myNum = 0;
        for(let i=0;i<line.length;i++){
            if(store.name == line[i].store.name){
                myNum = line[i].myNum;
                break;
            }
        }
        storesInfo.push({
            name:store.name,
            phone:store.phone,
            info:store.info,
            address:store.address,
            email:store.email,
            currentExhibit:store.currentExhibit,
            boothNo:store.boothNo,
            imgURL:store.imgURL,
            current:store.queue.current,
            total:store.queue.total,
            myNum: myNum
        })
    })
    console.log('getAllQueue');
    res.json({status:200,msg:storesInfo});
}

const login = async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    if(email===undefined || password === undefined){
        res.json({status:400,msg:'undefined email or password'});
        return;
    }
    let user = await User.findOneByEmail(email);
    if (user == null){
        res.json({status:401,msg:email+' does not exsist'});
        return 
    }
    if(user.auth == false){
        res.json({status:402,msg:'not authenticate'})
        return;
    }
    if(user.password === password){
        let token = jwt.sign({email:email},config.jwtSalt,{
            expiresIn: 60*60*24//24hr
        });
        res.json({status:200,token:token,user:user})
    }else{
        res.json({status:403,msg:'wrong password'})
    }
}
const edit = async (req,res)=>{
    const email = req.body.email;
    User.updateOne({email:email},{$set:{
        name : req.body.name,
        phone: req.body.phone,
        password:req.body.password
    }},function(error, user){
        if(error){
            console.log('updateStore error:'+error)
            res.json({status:400,msg:error});
        }else{
            if(user){
                console.log(user.name + ' has been edited')
                res.json({status:200,msg:user});
            }
        }
    })
}

const update = (req,res)=>{
    const email = req.body.email;
    let postKeyValue = req.body.postKeyValue;
    let input = req.body.input;
    User.updateOne({email:email},{
        [postKeyValue]:input
     },function(error, user2){
        if(error){
            console.log('updateStore error:'+error)
        }else{
            if(user2){
                res.json({status:200,msg:user2});
                console.log(user2.name+' has been updated')
            }
        }
     })
}
const remove = (req,res)=>{
    let email = req.body.email;
    
    User.deleteOne({email:email},function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log('user removed')
            res.json({status:200,msg:result});
        }
    })
}
const addStore = async(req,res)=>{
    const userEmail = req.body.userEmail;
    const storeEmail = req.body.storeEmail;
    const myNum = req.body.myNum;
    if(userEmail === undefined|| storeEmail === undefined|| myNum === undefined){
        res.json({status:400, msg:'input infomation missing'});
        return;
    }
    const store = await Store.findOne({email:storeEmail});
    if(store == null){
        //此處應修改為新建立一個user給他然後加入 depends on infomation in req.body
        res.json({status:400,msg:'invalid store Email'});
        return;
    }
    let user = await User.findOneByEmail(userEmail);
    if(user == null){
        //此處應修改為新建立一個user給他然後加入 depends on infomation in req.body
        res.json({status:400,msg:'invalid user email'});
        return;
    }
    let userqueue = new UserQueue({
        myNum : myNum,
        store : store
    });
    await userqueue.save()
    User.updateOne({email:userEmail},{$push:{ line : userqueue }},function(error, result){
        if(error){
            console.log(error)
        }else{
            res.json({status:200,msg:userqueue});
        }
        
    });
}
const getUserSchema = (req,res)=>{
    res.json({status:200,msg:Object.keys(UserSchema.obj)});
}
module.exports = {
    create,
    getUser,
    test,
    login,
    update,
    remove,
    getAllQueue,
    addStore,
    getLineByEmail,
    getUserSchema,
    edit,
}