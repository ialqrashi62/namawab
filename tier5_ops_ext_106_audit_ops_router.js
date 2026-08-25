// filepath: tier5_ops_ext_106_audit_ops_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ops_ext_106_audit_ops_engine.js');

const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/finding', asyncH(async (req, res) => res.json(engine.funcs().audit_finding(req.body))));
router.post('/followup', asyncH(async (req, res) => res.json(engine.funcs().followup_status(req.body))));
router.post('/kri', asyncH(async (req, res) => res.json(engine.funcs().kri_dashboard(req.body))));
router.post('/evidence', asyncH(async (req, res) => res.json(engine.funcs().evidence_checklist(req.body))));
router.post('/risk', asyncH(async (req, res) => res.json(engine.funcs().risk_register(req.body))));

module.exports = router;
