// filepath: tier5_home_health_ext_101_oasis_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_home_health_ext_101_oasis_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/oasis', asyncH(async (req, res) => res.json(engine.funcs().oasis_assess(req.body))));
router.post('/plan', asyncH(async (req, res) => res.json(engine.funcs().plan_of_care(req.body))));
router.post('/medrec', asyncH(async (req, res) => res.json(engine.funcs().medication_reconciliation(req.body))));
router.post('/falls', asyncH(async (req, res) => res.json(engine.funcs().fall_risk_home(req.body))));
router.post('/caregiver', asyncH(async (req, res) => res.json(engine.funcs().caregiver_assessment_hh(req.body))));

module.exports = router;
