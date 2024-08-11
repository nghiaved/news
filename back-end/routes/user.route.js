const express = require('express')
const userController = require('../controllers/user.controller')

const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/list', userController.list)
router.get('/get-info/:username', userController.getInfo)
router.put('/update-info', userController.updateInfo)
router.delete('/delete-account', userController.deleteAccount)
router.patch('/change-password', userController.changePassword)

module.exports = router
