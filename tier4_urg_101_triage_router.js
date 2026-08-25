'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_urg_101_triage_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/esi', asyncH((req, res) => res.json(engine.esi(req.body))));
router.post('/cc', asyncH((req, res) => res.json(engine.chiefComplaint(req.body))));
module.exports = router;