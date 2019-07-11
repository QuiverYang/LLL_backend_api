const User = require('../models/user');  //拿到mongoose.model('User',userSchema)
const Store = require('../models/store'); 
const jwt = require('jsonwebtoken');
const config = require('../config');

const create =  async (req, res, next)=>{
    let password = req.body.password;
    let lastName = req.body.lastName;
    let firstName = req.body.firstName;
    let birthday = req.body.birthday;
    let phone = req.body.phone;
    let gender = req.body.gender;
    let email = req.body.email;
    // if(password === undefined||
    //     lastName === undefined||
    //     firstName === undefined||
    //     birthday === undefined||
    //     phone === undefined||
    //     gender === undefined||
    //     email === undefined){
    //     res.json({status:400, msg:'Bad Request'});
    //     return;
    // }
    let tempUser = await User.findOneByEmail(email);
    if(tempUser != null){
        res.json({status:401,msg:'email has been registered'});
        return;
    }
    let user = new User({
        name : {
            firstName: firstName,
            lastName:lastName
        },
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
    let users = await User.findOneByName(req.query.firstName, req.query.lastName);
    res.json({status:-1,msg:{users:users}});
}

const getAllQueue = async (req,res,next)=>{
    let exhibitionName = req.query.exhibitionName;
    if(exhibitionName === undefined){
        res.json({status:400,msg:'undefinded exhibitionName '})
    }
    console.log(exhibitionName)
    const stores = await Store.find({currentExhibit:exhibitionName}).populate('queue');
    if(stores == null){
        res.json({status:400,msg:'invalid exhibitionName'})
    }
    console.log(stores);
    let storesInfo =[]
    stores.forEach(function(store){
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
            total:store.queue.total
        })
    })
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
const update = (req,res)=>{
    const email = req.body.email;
    User.updateOne({email:email},{$set:{
        name : {
            firstName: req.body.firstName,
            lastName:req.body.lastName
        },
        email:req.body.email,
        birthday: req.body.birthday,
        gender: req.body.gender,
        phone: req.body.phone,
        password:req.body.password
    }},function(error, user){
        if(error){
            console.log('updateStore error:'+error)
        }else{
            if(user){
                res.json({status:200,msg:user});
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
            // console.log(result);
            console.log('user removed')
            res.json({status:200,msg:result});
        }
    })
}

module.exports = {
    create,
    getUser,
    test,
    login,
    update,
    remove,
    getAllQueue,
}