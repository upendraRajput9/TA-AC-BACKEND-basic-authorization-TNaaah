var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    content: {type: String, required: true},
    author:{type:String, required:true},
    likes:{type:Number,default:0, minimum: 0},
    articleId: {type: Schema.Types.ObjectId, ref:"Article" , required:true}
},{timestamps:true});

module.exports = mongoose.model("Comment",commentSchema)