const Store = require('../models/store');
const Exhibition = require('../models/exhibition');

const setting=()=>{
    let timer = setInterval(dump,1000*60*60);
    let today = new Date();
    function dump (){
        let compareDate = new Date(today.toLocaleDateString());
        let now = new Date(new Date().toLocaleDateString());
        // console.log(compareDate, now) //2019-08-05T00:00:00.000Z 2019-08-05T00:00:00.000Z
        if( compareDate < now ){
            dumpStoreExhibit(compareDate);
            today = new Date()
            console.log('dump')
        }else{
            console.log('not dump')
        }
        // if(count > 5){
        //     clearInterval(timer);
        // }
        // return count++;
    }
}

const dumpStoreExhibit = async (date)=>{
    var endDate = null;
    Exhibition.find({},function(err, exs){
        if(err){
            console.log('dumpStoreExhibit error');
            return;
        }else if(exs){
            exs.forEach(function(ex,index,arr){
                endDate = ex.end;
                Store.find({currentExhibit:ex.name},async function(err, stores){
                    if(err){
                        console.log('dumpStoreExhibit error');
                        console.log(err);
                        res.send('dumpStoreExhibit error')
                        return
                    }else if(stores){
            
                        for(let i = 0; i < stores.length; i++){
                            
                            let historyVisitorTime = stores[i].visitorTime;
                            let historyQueue = stores[i].queue;
                            let historyPost = stores[i].post;
                            let history = await History.create({
                                date: date.addHours(8),
                                historyVisitorTime:historyVisitorTime,
                                historyPost:historyPost,
                                historyQueue:historyQueue
                            })
                            if(stores[i].history === undefined){
                                stores[i].history = [];
                            }
                            stores[i].history.push(history);
                            let queue = await Queue.create({
                                exhibitionName:currentEx,
                                storeName : stores.name,
                                current : 0,
                                total: 0,
                                visitor: []
                            })
                            stores[i].queue = queue;
                            stores[i].visitorTime = [];
                            if(date>=endDate){
                                stores[i].post=[];
                            }
                            stores[i].save();
                        }
                        console.log('dumpStoreExhibit');
                        res.send('dump stores visitorTime, queue and post');
                    }else{
                        console.log('invalid dumpStoreExhibit');
                        res.send('invalid exhibitionName');
                    }
                })
            })
            
        }
    })
    
}


module.exports = setting;