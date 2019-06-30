const QueueWay = require('../utils/queueWay');
const queue = new QueueWay();

const a = (req,res)=>{
    queue.enqueue('test1');
    queue.enqueue('test2');
    console.log(queue.size());
    let bb = queue.size();
    res.send(bb+'');
}

module.exports = {
    a,
}