var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var adminSchema = new Schema({
    name:String,
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
})

adminSchema.pre('save',function(next){
if(this.password&&this.isModified('password')){
    bcrypt.hash(this.password,10,(err,hashing)=>{
        if(err) return next(err);
        this.password = hashing;
        console.log(this.password);
        return next()
    })
}else{
    return next()
}
})

adminSchema.methods.verifyPassword = function(password,cb){
    bcrypt.compare(password,this.password,(err,result)=>{
        return cb(err,result)
    })
} 



module.exports = mongoose.model('Admin',adminSchema);