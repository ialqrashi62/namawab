'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_paediatric_101_growth_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/percentile', asyncH((req, res) => res.json(engine.growthPercentile(req.body))));
router.post('/velocity', asyncH((req, res) => res.json(engine.growthVelocityCheck(req.body))));
module.exports = router;