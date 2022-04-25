var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productSchema = new Schema({
    name:{type:String,required:true},
    quantity:{type:Number,required:true},
    price:{type:Number,required:true},
    image:{type:String},
    likes:{type:Number,minlength:0,default:0}
})

module.exports = mongoose.model('Product',productSchema);
