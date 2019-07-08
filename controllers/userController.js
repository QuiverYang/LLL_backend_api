const User = require('../models/user');  //拿到mongoose.model('User',userSchema)

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
        password:password
    });
    user.save().then(() => res.json({status:200, msg: user}));
}


const test = (req,res)=>{
    res.send("test page");
}

//異步處理的寫法
const getUser = async (req,res,next)=>{
    let users = await User.findOneByName(req.query.firstName, req.query.lastName);
    res.json({status:-1,msg:{users:users}});
}

//同步處理的寫法
// const getUser = ()=>{
//     User.findByName(req.body.firstName, req.body.lastName).exec((err, users)=>{ //要先找到之後才exec
//         res.json(users);
//     })
// }

// const getUser2 = async (req, res, next) => {
//     let users = await User.find().byName(req.body.first, req.body.last);
//     res.json({status:-1,msg:{users:users}});
// }

// const getSameGender = async (req, res)=>{
//     let user = await User.findOneByName(req.query.firstName, req.query.lastName);//因為findByName是用findOne()方法找到的 所以會回一個
//     //沒有找到的話可能為null
//     //如果是[]的話 可能為undefined
//     if(user === null){
//         res.send("user doesn't exsist!!");
//         return;
//     }
//     let result = await user.findSameGender();
//     res.json({status:-1,msg:{users:result}});
// }

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
    if(user.password === password){
        res.json({status:200,msg:'login success'})
    }else{
        res.json({status:401,msg:'wrong password'})
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
    console.log('req.params: ')
    console.log(req.body);
    User.deleteOne({email:email},function(err,result){
        if(err){
            console.log(err);
        }else{
            // console.log(result);
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
}