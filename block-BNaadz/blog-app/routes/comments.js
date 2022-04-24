var express = require('express')
var Comment = require('../models/Comment')
var Article = require('../models/Article')
var auth = require('../middleware/auth')

var router = express.Router()

router.get('/:id/edit', auth.loggedInUser, (req, res) => {
  let id = req.params.id
  Comment.findById(id, (err, comment) => {
    if (err) return next(err)
    if (req.user.name == comment.author) {
      res.render('commentUpdate', { comment })
    } else {
      res.redirect('/users/login')
    }
  })
})
router.post('/:id', (req, res) => {
  let id = req.params.id
  Comment.findByIdAndUpdate(
    id,
    { content: req.body.content },
    (err, comment) => {
      if (err) return next(err)
      res.redirect('/articles/' + comment.articleId)
    },
  )
})

router.get('/:id/delete', (req, res) => {
  let id = req.params.id
  Comment.findById(id, (err, comment) => {
    if (err) return next(err)
    if (req.user.name == comment.author) {
      Comment.findByIdAndRemove(id, (err, comment) => {
        if (err) return next(err)
        Article.findByIdAndUpdate(
          comment.articleId,
          { $pull: { comments: comment._id } },
          (err, article) => {
            res.redirect('/articles/' + comment.articleId)
          },
        )
      })
    } else {
      res.redirect('/users/login')
    }
  })
})

router.get('/:id/like', auth.loggedInUser, (req, res) => {
  let id = req.params.id
  Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, comment) => {
    if (err) return next(err)
    res.redirect('/articles/' + comment.articleId)
  })
})
router.get('/:id/dislike', auth.loggedInUser, (req, res) => {
  let id = req.params.id
  Comment.findById(id, (err, comment) => {
    if (comment.likes > 0) {
      Comment.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, comment) => {
        if (err) return next(err)
        res.redirect('/articles/' + comment.articleId)
      })
    } else {
      res.redirect('/articles/' + comment.articleId)
    }
  })
})

module.exports = router
