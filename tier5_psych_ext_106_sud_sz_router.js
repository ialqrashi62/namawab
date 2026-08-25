// filepath: tier5_psych_ext_106_sud_sz_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_psych_ext_106_sud_sz_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/withdrawal', asyncH(async (req, res) => res.json(engine.funcs().withdrawal_risk(req.body))));
router.post('/auditc', asyncH(async (req, res) => res.json(engine.funcs().audit_c(req.body))));
router.post('/mat', asyncH(async (req, res) => res.json(engine.funcs().mat_protocol(req.body))));
router.post('/sz-onset', asyncH(async (req, res) => res.json(engine.funcs().sz_onset(req.body))));
router.post('/clozapine', asyncH(async (req, res) => res.json(engine.funcs().clozapine_candidate(req.body))));

module.exports = router;
