const express = require('express')
const passport = require('passport')
const controller = require('../controllers/archivedTasks')
const router = express.Router()

router.get('/getAll', passport.authenticate('jwt', {session: false}), controller.getAllTask)
router.get('/:clientName', controller.getArchiveByClientName)
// router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.post('/', passport.authenticate('jwt', {session: false}), controller.achiveTasks)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove)


module.exports = router