// filepath: tier5_mtm_ext_106_outcomes_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_mtm_ext_106_outcomes_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/pdc', asyncH(async (req, res) => res.json(engine.funcs().pdc(req.body))));
router.post('/cmr', asyncH(async (req, res) => res.json(engine.funcs().cmr_completion(req.body))));
router.post('/accept', asyncH(async (req, res) => res.json(engine.funcs().intervention_acceptance(req.body))));
router.post('/cost', asyncH(async (req, res) => res.json(engine.funcs().cost_savings(req.body))));
router.post('/clin', asyncH(async (req, res) => res.json(engine.funcs().clinical_outcomes(req.body))));
router.post('/doc', asyncH(async (req, res) => res.json(engine.funcs().documentation_completeness(req.body))));

module.exports = router;
