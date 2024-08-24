const express = require('express')
const commentController = require('../controllers/comment.controller')

const router = express.Router()

router.get('/get-all-comments', commentController.getAllComments)
router.post('/send-comment', commentController.sendComment)

module.exports = router
