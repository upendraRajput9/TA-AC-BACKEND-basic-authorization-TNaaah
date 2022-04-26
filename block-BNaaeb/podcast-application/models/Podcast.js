var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var podcostSchema = new Schema({
    title:{type:String,required:true},
    singer:{type:String},
    description:{type:String,required:true},
    cover:{type:String,required:true},
    audioTrack:{type:String,required:true},
    isVerified: {type: Boolean, default: false},
    subscription:{type:String,default:"free"},
    likes:{type:Number,default:0},
    dislikes:{type:Number,default:0},
    comments:[{type:Schema.Types.ObjectId, ref:'Comment'}]
})

module.exports = mongoose.model('Podcast',podcostSchema);