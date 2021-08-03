const express = require ('express')
const router = express.Router()
const Controller = require('../controllers/controllerTarget.js')

router.get('/active/:userId', Controller.getActiveTargetByUser)
router.put('/active/:userId', Controller.editActiveTargetByUser)
router.patch('/status/:userId', Controller.editActiveTargetStatusByUser)

router.get('/all/:userId', Controller.getTargetByUser)
router.post('/all/:userId', Controller.addTargetByUser)
// router.delete('/all/:targetId', Controller.deleteTargetById)

module.exports = router