'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_onc_101_solid_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/tnm', asyncH((req, res) => res.json(engine.tnmStaging(req.body))));
router.post('/ecog', asyncH((req, res) => res.json(engine.ecogPerformanceStatus(req.body))));
module.exports = router;