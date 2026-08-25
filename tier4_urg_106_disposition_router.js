'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_urg_106_disposition_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/dc', asyncH((req, res) => res.json(engine.dischargeReadiness(req.body))));
router.post('/admit', asyncH((req, res) => res.json(engine.admissionDecision(req.body))));
module.exports = router;