'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_onc_104_radiation_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/plan', asyncH((req, res) => res.json(engine.radiotherapyPlan(req.body))));
router.post('/toxicity', asyncH((req, res) => res.json(engine.radiationToxicity(req.body))));
module.exports = router;