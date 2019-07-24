const Exhibit = require('../models/exhibition');
const ExhibitionSchema = require('mongoose').model('Exhibition').schema;


const create =(req, res)=>{
    let name = req.body.name;
    let start = req.body.start;
    let end = req.body.end;
    if(name === undefined || start === undefined || end ===undefined){
        console.log('missing input form exhibition create');
        res.send('missing input form exhibition create');
        return;
    }
    Exhibit.create({
        name:name,
        start:new Date(start),
        end:new Date(end)
    })
    console.log('exhibtion created');
    res.json({status:200,msg:'exhibition created'})
}

const remove = (req,res)=>{
    let name = req.body.name;
    
    Exhibit.deleteOne({name:name},function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log('exhibition removed')
            res.json({status:200,msg:result});
        }
    })
    
}

const update = async (req,res) =>{
    let name = req.body.name;
    let postKeyValue = req.body.postKeyValue;
    let input = req.body.input;
    if(postKeyValue !== 'name'){
        input = new Date(req.body.input);
    }
    console.log(`name:${name}, postKeyValue:${postKeyValue}, input:${input}`);
    let exhibit = await Exhibit.findOne({name:name});
    if(exhibit === null){
        res.json({status:1, msg:'店家不存在'});
        return;
    }
    Exhibit.updateOne({name:name},{
        [postKeyValue]:input
     },function(error, exhibit2){
        if(error){
            console.log('updateExhibition error:'+error)
        }else{
            if(exhibit2){
                console.log(exhibit2.name + ' has been updated')
                res.json({status:200,msg:exhibit2});
            }
        }
     })
}
const getAllExhibitName = (req,res)=>{
    Exhibit.find(function(error, exhibitions){
        if(error){
            console.log(error);
            return;
        }else{
            let names = [];
            exhibitions.forEach(function(ex,index,arr){
                names.push(ex.name);
            })
            console.log('getAllExhibitionName');
            res.json({status:200,msg:names});
        }
    })
}
const getExhibitionSchema = (req,res)=>{
    console.log('getExhibitionSchema');
    res.json({status:200,msg:Object.keys(ExhibitionSchema.obj)});
}
const getAllPosts = async (req,res)=>{
    let name = req.query.name;
    let exhibit = await Exhibit.findOne({name:name},function(err){
        if(err){
            console.log('getAllPosts error: '+ error);
        }
    }).populate('allPosts');
    console.log('getAllPosts');
    res.json({status:200,msg:exhibit.allPosts});
}
const getAllPostsLength= (req,res)=>{
    let name = req.query.name;
    Exhibit.findOne({name:name},function(err,ex){
        if(err){
            console.log('getAllPostsLength error '+ err);
            return;
        }else{
            console.log('getAllPostLength');
            res.json({status:200, msg:ex.allPosts.length})
        }
    })
}

module.exports = {
    create,
    getAllExhibitName,
    getExhibitionSchema,
    remove,
    update,
    getAllPosts,
    getAllPostsLength,
}