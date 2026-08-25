'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pall_ext_101_pain_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/who', asyncH((req, res) => res.json(engine.whoCancerPainLadder(req.body))));
router.post('/opioid', asyncH((req, res) => res.json(engine.opioidDoseCalculation(req.body))));
module.exports = router;