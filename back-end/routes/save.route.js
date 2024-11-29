const express = require('express')
const saveController = require('../controllers/save.controller')

const router = express.Router()

router.get('/get-all-saves', saveController.getAllSaves)
router.post('/create-save', saveController.createSave)
router.delete('/delete-save', saveController.deleteSave)

module.exports = router
