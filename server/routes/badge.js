const express = require ('express')
const router = express.Router()
const Controller = require('../controllers/controllerBadge.js')

router.get('/', Controller.getAllBadges)
router.get('/:badgeId', Controller.getBadgeById)

module.exports = router