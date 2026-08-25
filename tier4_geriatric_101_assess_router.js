'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_geriatric_101_assess_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/cga', asyncH((req, res) => res.json(engine.comprehensiveGeriatricAssessment(req.body))));
router.post('/adl', asyncH((req, res) => res.json(engine.adlIadlScore(req.body))));
module.exports = router;