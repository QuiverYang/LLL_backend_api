const Exhibit = require('../models/exhibition');
const ExhibitionSchema = require('mongoose').model('Exhibition').schema;
const Store = require('../models/store');

Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
};

const create =async (req, res)=>{
    let name = req.body.name;
    let start = req.body.start;
    let end = req.body.end;
    let address = req.body.address;
    let url = req.body.url;
    // console.log('url: ' + url)
    // console.log('start: '+ start);
    // console.log('end '+ end);
    if(name === undefined || start === undefined || end ===undefined || address === undefined || url === undefined){
        console.log('missing input form exhibition create');
        res.send('missing input form exhibition create');
        return;
    }
    Exhibit.create({
        name:name,
        address:address,
        url:url,
        start:new Date(start).addHours(8),
        end:new Date(end).addHours(8),
    })
    console.log('exhibtion created');
    res.json({status:200,msg:'exhibition created'})
}

const addStores =async (req,res)=>{
    let emails = req.body.email; //可以是array
    let exhibitName = req.body.name.trim();
    
    if(Array.isArray(emails)){
        emails.forEach(function(em){
            Store.findOne({email:em},async function(err,store){
                if(err){
                    console.log('addStore store.find error');
                    res.json({status:400, msg:'addStore store.find error'})
                    return;
                }else{
                    await Exhibit.updateOne({name:exhibitName},{$push:{allStores:store}});
                    
                }
            })
        });
    }else{
        Store.findOne({email:emails},async function(err,store){
            if(err){
                console.log('addStore store.find error');
                return;
            }else{
               console.log(store);
                await Exhibit.updateOne({name:exhibitName},{$push:{allStores:store}})
            }
        })
    }
    res.json({status:200, msg:'store added to exhibition'});
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
const getNamesAndAddress =(req,res)=>{
    var result = [];
    var tempExName = [];
    Exhibit.find(function(err,exs){
        if(err){
            console.log('getNamesAndAddress error');
            res.json({status:400,msg:'getNamesAndAddress'});
            return;
        }else{
            exs.forEach(function(ex,index,arr){
                result.push({name:ex.name, address: ex.address, url: ex.url});
            })
            res.json({status:200, msg:result});
        }
    })
}
const getExhibitionSchema = (req,res)=>{
    console.log('getExhibitionSchema');
    res.json({status:200,msg:Object.keys(ExhibitionSchema.obj)});
}
const getAllPosts = async (req,res)=>{
    let name = req.query.name;
    let exhibit = await Exhibit.findOne({name:name},function(err,exhibit){
        if(err){
            console.log('getAllPosts error: '+ error);
            return;
        }else if(!exhibit){
            console.log('exhibition invalid');
            res.json({status:400,msg:'exhibition invalid'});
            return;
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
        }else if(!ex){
            console.log('exhibition invalid');
            res.json({status:400,msg:'exhibition invalid'});
            return;
        }
        else{
            console.log('getAllPostLength');
            res.json({status:200, msg:ex.allPosts.length});
        }
    })
}
const getDate=(req,res)=>{
    let name = req.query.name;
    Exhibit.findOne({name:name},function(err,ex){
        if(err){
            console.log('getDate error '+ err);
            return;
        }else if(!ex){
            console.log('exhibition invalid');
            res.json({status:400,msg:'exhibition invalid'});
            return;
        }
        else{
            console.log('getDate');
            res.json({status:200, msg:{start:ex.start, end:ex.end}});
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
    getNamesAndAddress,
    addStores,
    getDate
}