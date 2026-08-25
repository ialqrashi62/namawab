'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_family_104_smoking_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/fiveAs', asyncH((req, res) => res.json(engine.fiveAs(req.body))));
router.post('/plan', asyncH((req, res) => res.json(engine.quitSmokingPlan(req.body))));
module.exports = router;