// filepath: tier5_rare_ext_101_orphan_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rare_ext_101_orphan_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/gate', asyncH(async (req, res) => res.json(engine.funcs().prevalence_gating(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().compassionate_use(req.body))));
router.post('/reg', asyncH(async (req, res) => res.json(engine.funcs().orphan_registry(req.body))));
router.post('/genetest', asyncH(async (req, res) => res.json(engine.funcs().genetic_testing_referral(req.body))));
router.post('/trial', asyncH(async (req, res) => res.json(engine.funcs().clinical_trial_match(req.body))));

module.exports = router;
