const User = require('../models/user');  //拿到mongoose.model('User',userSchema)
const id = 1;
var idGen = id;

const create =  async (req, res, next)=>{
    let password = req.body.password;
    let lastName = req.body.last;
    let firstName = req.body.first;
    let birth = req.body.birthday;
    let phone = req.body.phone;
    let gender = req.body.gender;

    if(password === undefined||
        lastName === undefined||
        firstName === undefined||
        birth === undefined||
        phone === undefined||
        gender === undefined){
        res.json({status:1, msg:'Bad Request'});
        return;
    }
    let user = new User({
        name : {
            firstName: firstName,
            lastName:lastName
        },
        id : await User.countDocuments()+1,
        birth: birth,
        gender: gender,
        phone: phone,
        password:password
    });
    user.save().then(() => res.json({status:1, msg: user}));
}


const test = (req,res)=>{
    res.send("test page");
}

//異步處理的寫法
const getUser = async (req,res,next)=>{
    let users = await User.findByName(req.query.firstName, req.query.lastName);
    res.json({status:-1,msg:{users:users}});
}

//同步處理的寫法
// const getUser = ()=>{
//     User.findByName(req.body.firstName, req.body.lastName).exec((err, users)=>{ //要先找到之後才exec
//         res.json(users);
//     })
// }

const getUser2 = async (req, res, next) => {
    let users = await User.find().byName(req.body.first, req.body.last);
    res.json({status:-1,msg:{users:users}});
}

const getSameGender = async (req, res)=>{
    let user = await User.findByName(req.query.firstName, req.query.lastName);//因為findByName是用findOne()方法找到的 所以會回一個
    //沒有找到的話可能為null
    //如果是[]的話 可能為undefined
    if(user === null){
        res.send("user doesn't exsist!!");
        return;
    }
    let result = await user.findSameGender();
    res.json({status:-1,msg:{users:result}});
}

module.exports = {
    create,
    getUser,
    getUser2,
    getSameGender,
    test
}