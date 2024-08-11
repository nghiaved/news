const express = require('express')
const postController = require('../controllers/post.controller')

const router = express.Router()

router.get('/get-all-my-posts', postController.getAllMyPosts)
router.get('/get-all-posts', postController.getAllPosts)
router.post('/create-post', postController.createPost)
router.put('/update-post', postController.updatePost)
router.delete('/delete-post', postController.deletePost)

module.exports = router
