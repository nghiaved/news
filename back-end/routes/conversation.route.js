const express = require('express')
const conversationController = require('../controllers/conversation.controller')

const router = express.Router()

router.get('/get-conversation', conversationController.getConversation)
router.get('/get-all-conversations', conversationController.getAllConversations)
router.post('/create-conversation', conversationController.createConversation)

module.exports = router
