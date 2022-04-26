var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    author:{type:String,required:true},
    content:{type:String,required:true}
},{timestamps:true});

module.exports = mongoose.model('Comment',commentSchema);