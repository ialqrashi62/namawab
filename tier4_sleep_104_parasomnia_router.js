'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_sleep_104_parasomnia_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/rbd', asyncH((req, res) => res.json(engine.remSleepBehavior(req.body))));
router.post('/rls', asyncH((req, res) => res.json(engine.restlessLegs(req.body))));
module.exports = router;