const express = require('express');
const passport = require('passport');
const controller = require('../controllers/statistics');
const router = express.Router();

router.get('/:name', passport.authenticate('jwt', { session: true }), controller.getStatisticByName);

module.exports = router;