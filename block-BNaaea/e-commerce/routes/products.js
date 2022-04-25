var express = require('express')
var path = require('path')
var fs = require('fs')
var Product = require('../models/Product')
var multer = require('multer')
const User = require('../models/User')
var router = express.Router()

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images')
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

var upload = multer({ storage: storage })
//product page
router.get('/new', (req, res) => {
  let id = req.params.id
  res.render('productForm.ejs')
})

router.get('/', (req, res, next) => {
  User.findById(req.user._id, (err, user) => {
    if (err) return next(err)
    Product.find({}, (err, products) => {
      if (err) return next(err)
      res.render('products', {
        list: products,
        userId: user.id,
        isAdmin: user.isAdmin,
      })
    })
  })
})

//get product added form
router.post('/new', upload.single('image'), (req, res, next) => {
  var id = req.params.id
  req.body.image = req.file.filename
  Product.create(req.body, (err, product) => {
    if (err) return next(err)
    console.log(product)
    res.redirect('/products')
  })
})

//create product
router.get('/admin',(req,res,next)=>{
    console.log(req.user)
    User.find({},(err,users)=>{
        if(err) return next(err)
        res.render('dashboard',{list:users})
    })
   
})

//detail page
router.get('/:id', (req, res, next) => {
    var id = req.params.id
  User.findById(req.user._id, (err, user) => {
    if (err) return next(err)
    Product.findById(id, (err, product) => {
      console.log(product)
      if (err) return next(err)
      res.render('detail', { product: product, isAdmin:user.isAdmin})
    })
  })
})
//likes
router.get('/:id/like', (req, res, next) => {
  var id = req.params.id
  var userId = req.params.userId
  Product.findByIdAndUpdate(id, { $inc: { likes: +1 } }, (err, product) => {
    if (err) return next(err)
    res.redirect('/products/' + id + '/' + userId)
  })
})
//dislike
router.get('/:id/dislike', (req, res, next) => {
  var id = req.params.id
  Product.findById(id, (err, product) => {
    if (err) return next(err)
    if (product.likes > 0) {
      Product.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err) => {
        if (err) return next(err)
        res.redirect('/products/' + id + '/' + userId)
      })
    }
  })
})
//edit
router.get('/:id/edit', (req, res, next) => {
  var id = req.params.id
  var adminId = req.params.adminId
  Product.findById(id, (err, product) => {
    if (err) return next(err)
    res.render('editProduct', { product: product })
  })
})

router.post('/:id/edit', upload.single('image'), (req, res, next) => {
  var id = req.params.id
  if (req.file != undefined) {
    req.body.image = req.file.filename
  }
  Product.findByIdAndUpdate(id, req.body, (err, product) => {
    if (err) return next(err)
    let iteam = path.join('public/images/' + product.image)
    if (req.file != undefined) {
      fs.unlink(iteam, function (err) {
        return res.redirect('/products/' + id )
      })
    } else {
      return res.redirect('/products/' + id )
    }
  })
})

//delete
router.get('/:id/delete', (req, res, next) => {
  var id = req.params.id
 
  Product.findByIdAndDelete(id, (err, product) => {
    if (err) return next(err)
    let iteam = path.join('public/images/' + product.image)
    fs.unlink(iteam, function (err) {
      if (err) return next(err)
      res.redirect('/products/' )
    })
  })
})

module.exports = router
