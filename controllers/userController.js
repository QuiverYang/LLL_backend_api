const User = require('../models/user');  //拿到mongoose.model('User',userSchema)

const create =  async (req, res, next)=>{
    let password = req.body.password;
    let lastName = req.body.last;
    let firstName = req.body.first;
    let birth = req.body.birthday;
    let phone = req.body.phone;
    let gender = req.body.gender;
    let email = req.body.email;

    if(password === undefined||
        lastName === undefined||
        firstName === undefined||
        birth === undefined||
        phone === undefined||
        gender === undefined||
        email === undefined){
        res.json({status:400, msg:'Bad Request'});
        return;
    }
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
        birth: birth,
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

module.exports = {
    create,
    getUser,
    // getUser2,
    // getSameGender,
    test,
    login
}