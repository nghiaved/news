const express = require('express')
const emotionController = require('../controllers/emotion.controller')

const router = express.Router()

router.get('/get-all-emotions', emotionController.getAllEmotions)
router.patch('/read-emotion', emotionController.readEmotion)

module.exports = router
