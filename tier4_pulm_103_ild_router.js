'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pulm_103_ild_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/ipf', asyncH((req, res) => res.json(engine.ipfManagement(req.body))));
router.post('/workup', asyncH((req, res) => res.json(engine.ildDiagnosisWorkup(req.body))));
module.exports = router;