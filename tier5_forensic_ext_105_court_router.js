// filepath: tier5_forensic_ext_105_court_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_forensic_ext_105_court_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/court-prep', asyncH(async (req, res) => res.json(engine.funcs().court_prep(req.body))));
router.post('/testimony', asyncH(async (req, res) => res.json(engine.funcs().expert_testimony(req.body))));
router.post('/evidence-handling', asyncH(async (req, res) => res.json(engine.funcs().evidence_handling(req.body))));
router.post('/records-release', asyncH(async (req, res) => res.json(engine.funcs().records_release(req.body))));
router.post('/safeguard', asyncH(async (req, res) => res.json(engine.funcs().safeguarding(req.body))));

module.exports = router;
