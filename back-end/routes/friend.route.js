const express = require('express')
const friendController = require('../controllers/friend.controller')

const router = express.Router()

router.get('/get-friend', friendController.getFriend)
router.get('/get-list-friends', friendController.getListFriends)
router.get('/get-list-requests', friendController.getListRequests)
router.post('/send-request', friendController.sendRequest)
router.patch('/accept-request', friendController.acceptRequest)
router.delete('/delete-friend', friendController.deleteFriend)

module.exports = router
