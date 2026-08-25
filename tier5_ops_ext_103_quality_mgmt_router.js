// filepath: tier5_ops_ext_103_quality_mgmt_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ops_ext_103_quality_mgmt_engine.js');

const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/rate', asyncH(async (req, res) => res.json(engine.funcs().rate_indicator(req.body))));
router.post('/controlchart', asyncH(async (req, res) => res.json(engine.funcs().control_chart(req.body))));
router.post('/fmea', asyncH(async (req, res) => res.json(engine.funcs().fmea(req.body))));
router.post('/rca-priority', asyncH(async (req, res) => res.json(engine.funcs().rca_priority(req.body))));
router.post('/patient-safety', asyncH(async (req, res) => res.json(engine.funcs().patient_safety(req.body))));

module.exports = router;
