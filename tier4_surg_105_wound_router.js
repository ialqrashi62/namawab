'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_surg_105_wound_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/assess', asyncH((req, res) => res.json(engine.woundAssessment(req.body))));
router.post('/npwt', asyncH((req, res) => res.json(engine.npwtIndication(req.body))));
module.exports = router;