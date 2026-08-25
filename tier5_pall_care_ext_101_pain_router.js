// filepath: tier5_pall_care_ext_101_pain_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pall_care_ext_101_pain_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/assess', asyncH(async (req, res) => res.json(engine.funcs().pain_assessment(req.body))));
router.post('/rot', asyncH(async (req, res) => res.json(engine.funcs().opioid_rotation(req.body))));
router.post('/bt', asyncH(async (req, res) => res.json(engine.funcs().breakthrough(req.body))));
router.post('/se', asyncH(async (req, res) => res.json(engine.funcs().opioid_side_effects(req.body))));
router.post('/nonop', asyncH(async (req, res) => res.json(engine.funcs().non_opioid_analgesics(req.body))));
router.post('/risk', asyncH(async (req, res) => res.json(engine.funcs().opioid_risk(req.body))));
module.exports = router;
