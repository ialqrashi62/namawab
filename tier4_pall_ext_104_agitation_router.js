'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pall_ext_104_agitation_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/terminal', asyncH((req, res) => res.json(engine.terminalAgitationAssessment(req.body))));
router.post('/delirium', asyncH((req, res) => res.json(engine.palliativeDeliriumManagement(req.body))));
module.exports = router;