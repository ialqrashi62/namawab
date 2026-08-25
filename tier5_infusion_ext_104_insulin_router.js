// filepath: tier5_infusion_ext_104_insulin_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_infusion_ext_104_insulin_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/cand', asyncH(async (req, res) => res.json(engine.funcs().pump_candidate(req.body))));
router.post('/basal', asyncH(async (req, res) => res.json(engine.funcs().basal_rate(req.body))));
router.post('/ratio', asyncH(async (req, res) => res.json(engine.funcs().carb_ratio(req.body))));
router.post('/cgm', asyncH(async (req, res) => res.json(engine.funcs().cgm_review(req.body))));
router.post('/hcl', asyncH(async (req, res) => res.json(engine.funcs().hybrid_closed_loop(req.body))));
router.post('/fail', asyncH(async (req, res) => res.json(engine.funcs().pump_failure(req.body))));
module.exports = router;
