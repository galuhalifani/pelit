const express = require ('express')
const router = express.Router()
const Controller = require('../controllers/controllerAchievement.js')
var cron = require('node-cron')

router.get('/', Controller.autoAchievement)

router.post('/:userId/:badgeId', Controller.addAchievement)

module.exports = router