const express = require('express');
const passport = require('passport');
const controller = require('../controllers/clients');
const router = express.Router();

router.get('/:name', passport.authenticate('jwt', { session: false }), controller.getByName);
router.get('/', passport.authenticate('jwt', { session: false }), controller.getAll);
router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.remove);
router.post('/', passport.authenticate('jwt', { session: false }), controller.create);
router.patch('/:id', passport.authenticate('jwt', { session: false }), controller.update);

module.exports = router;
