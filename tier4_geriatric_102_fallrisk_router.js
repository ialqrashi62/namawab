'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_geriatric_102_fallrisk_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/assess', asyncH((req, res) => res.json(engine.fallRiskAssessment(req.body))));
router.post('/tug', asyncH((req, res) => res.json(engine.timedUpAndGo(req.body))));
module.exports = router;