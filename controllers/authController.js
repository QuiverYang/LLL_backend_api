const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

const getToken = (req,res)=>{
    User.findOne({phone:req.body.phone},(err,user)=>{
        if(err){
            res.json(err,null,res);
        }
        if(!user){
            res.json(err,null,res);
            return;
        }
        var token = jwt.sign({userId:user._id},config.jwtSalt,{
            expiresIn: 60*60*24//24hr
        });
        res.json({status:-1,token:token})
    })
}
const checkToken = (req,res,next)=>{
    var token = req.headers['x-access-token'];
    if(token){
        jwt.verify(token,config.jwtSalt,(err,decoded)=>{
            if(err){
                res.json(err,null,res);
                return;
            }else{
                req.decoded = decoded;//{userId:uswe._id}
                res.json({status:200,msg:'sucess'})
                next();
            }
        });
    }else{
        res.json({status:400,msg:'Fail'});
        return;
    }
}
const checkAuth = async (req,res,next) => {
    var token = req.query.token;
    if(token){
        jwt.verify(token,config.jwtSalt, async (err,decoded) => {
            if(err){
                res.json(err,null,res);
                return;
            }else{
                await User.update().updateAuth(decoded.email);
                res.json({status:200,msg:'Success checkAuth'})
            }
        });
        
    }else{
        res.json({status:400,msg:'Fail checkAuth'});
        return;
    }
}

module.exports = {
    getToken,
    checkToken,
    checkAuth
}