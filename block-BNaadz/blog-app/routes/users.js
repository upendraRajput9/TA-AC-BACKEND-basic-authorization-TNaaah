var express = require('express');
const User = require('../models/User');
var router = express.Router();
var auth = require('../middleware/auth');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('registerForm');
});

//create User
router.post('/',(req,res,next)=>{
  User.create(req.body,(err,user)=>{
    if(err) return res.redirect('/users/')
    res.redirect('/articles')
  })
})

//Get login page
router.get('/login',(req,res)=>{
  res.render('loginForm')
});

//login
router.post('/login',(req,res,next)=>{
 var {email,password} = req.body;
 if(!email || !password){
   return res.redirect('/users/login')
 };
 User.findOne({email},(err,user)=>{
  if (err) return next(err);
  if(!user){
    return res.redirect('/users/login')
  }
  user.verifyPassword(password,(err,result)=>{
   
    if(err) return next(err);
    if(!result){
      return res.redirect('/users/login')
    }else{
      req.session.userId = user.id;
      res.redirect('/articles/')
    }
  })
 })
})
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');

})
module.exports = router;
