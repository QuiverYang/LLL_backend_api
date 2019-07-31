const mongoose  = require('mongoose');

const Schema = mongoose.Schema;

msgsaveSchema = new Schema({
    exhibition: String,
    name: String,
    title: String,
    content: String,
    web: String,
    time: String
});

msgsaveSchema.query.byId = function(msgsaveId)  {
    return this.where({_id: msgsaveId});
};

msgsaveSchema.query.byName = function(name)  {
    return this.where({name: name});
};

msgsaveSchema.query.byNames = function(exhibition, name)  {
    return this.where({exhibition: exhibition, name: name});
};

module.exports = mongoose.model('Msgsave', msgsaveSchema);
