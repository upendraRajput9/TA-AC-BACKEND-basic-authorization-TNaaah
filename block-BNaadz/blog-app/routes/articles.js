var express = require('express')
var router = express.Router()
var Article = require('../models/Article')
var Comment = require('../models/Comment')
var auth = require('../middleware/auth')

/* GET Articles */
router.use(auth.userInfo)

router.get('/', function (req, res, next) {
  Article.find({}, (err, users) => {
    if (err) return next(err)
    res.render('articles',{list:users})
  })
})

router.get('/new', auth.loggedInUser,(req, res) => {
  res.render('articleForm',{user:req.user})
})

router.post('/', (req, res, next) => {
  req.body.tags = req.body.tags.trim().split(' ')
  req.body.author = req.user._id
  Article.create(req.body, (err, article) => {
    if (err) return next(err)
    res.redirect('/articles')
  })
})

//single article page
router.get('/:id',(req,res,next)=>{
    var id = req.params.id;
    Article.findById(id).populate("author comments").exec((err,article)=>{
        if (err) return next(err)
        res.render('singleArticle',{article})
    })
})



//edit

router.get('/:id/edit',auth.loggedInUser,(req, res, next)=>{
    let id = req.params.id;
    console.log(req.user)
    Article.findById(id).populate('author').exec((err,article)=>{
      if(err) return next(err);
      if(req.user.name==article.author.name){
        res.render("updateArticle",{article:article})
      }else{
          res.redirect('/users/login')
      }
     
    })
  });
  router.post("/:id/update",(req,res,next)=>{
    let id = req.params.id;
    Article.findByIdAndUpdate(id,req.body,(err,article)=>{
      if(err) return next(err)
      res.redirect("/articles/"+id)
    })
  })

  //delete
  
  router.get("/:id/delete",auth.loggedInUser,(req,res,next)=>{
    let id = req.params.id;
    Article.findById(id).populate('author').exec((err,article)=>{
        if(err) return next(err);
        if(req.user.name==article.author.name){
            Article.findByIdAndDelete(id,(err,article)=>{
                if(err) return next(err)
                res.redirect("/articles")
              })
        }else{
            res.redirect('/users/login')
        }
       
      })
  })
  
  //like
  router.get("/:id/like", auth.loggedInUser,(req,res,next)=>{
    let id = req.params.id;
    Article.findByIdAndUpdate(id,{$inc:{ likes: 1}},(err,article)=>{
      if(err) return next(err)
      res.redirect("/articles/"+id)
    })
  })

  //dislike
  router.get("/:id/dislike", auth.loggedInUser,(req,res,next)=>{
    let id = req.params.id;
    Article.findById(id,(err,article)=>{
        if(err) return next(err)
        if(article.likes>0){
            Article.findByIdAndUpdate(id,{$inc:{ likes: -1}},(err,article)=>{
                console.log(article)
                if(err) return next(err)
                res.redirect("/articles/"+id)
              })
        }else{
            res.redirect("/articles/"+id)
        }
    })
    
  })
  router.post("/:id/comments", auth.loggedInUser,(req,res,next)=>{
    let id = req.params.id;
    req.body.articleId=id;
    req.body.author= req.user.name
     Comment.create(req.body,(err,comment)=>{
      if(err) return next(err);
      Article.findByIdAndUpdate(id,{$push:{comments:comment._id}},(err,updatearticle)=>{
        if(err) return next(err);
        res.redirect("/articles/"+id)
      })
     
    })
    
  })
module.exports = router
