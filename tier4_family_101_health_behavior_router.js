'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_family_101_health_behavior_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/mi', asyncH((req, res) => res.json(engine.motivationalInterview(req.body))));
router.post('/changestage', asyncH((req, res) => res.json(engine.behaviorChange(req.body))));
module.exports = router;