'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_urg_103_injury_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/head', asyncH((req, res) => res.json(engine.headInjury(req.body))));
router.post('/fracture', asyncH((req, res) => res.json(engine.fractureRisk(req.body))));
module.exports = router;