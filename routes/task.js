const express = require('express')
const passport = require('passport')
const controller = require('../controllers/tasks')
const router = express.Router()

router.get('/getAll', passport.authenticate('jwt', {session: false}), controller.getAllTask)
router.get('/:clientName', passport.authenticate('jwt', {session: false}), controller.getByClientName)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove)


module.exports = router