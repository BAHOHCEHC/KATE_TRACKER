const express = require('express')
const passport = require('passport')
const upload = require('../middleware/upload')
const controller = require('../controllers/clients')
const router = express.Router()

// router.get('/', passport.authenticate('jwt', {session: false}), controller.getByToken)


router.get('/:name', passport.authenticate('jwt', {session: false}), controller.getByName)
router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove)
router.post('/', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.create)
router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.update)


module.exports = router