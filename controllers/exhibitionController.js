const Exhibit = require('../models/exhibition');

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

module.exports = {
    create,
    getAllExhibitName,
}