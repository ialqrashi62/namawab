'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_neph_107_transplant_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/eligibility', asyncH((req, res) => res.json(engine.transplantEvaluation(req.body))));
router.post('/rejection', asyncH((req, res) => res.json(engine.rejectionRisk(req.body))));
module.exports = router;