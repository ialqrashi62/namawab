// filepath: tier5_psych_ext_103_anxiety_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_psych_ext_103_anxiety_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/cbat', asyncH(async (req, res) => res.json(engine.funcs().cbat_timeline(req.body))));
router.post('/panic', asyncH(async (req, res) => res.json(engine.funcs().panic_assess(req.body))));
router.post('/social', asyncH(async (req, res) => res.json(engine.funcs().social_anxiety(req.body))));
router.post('/school', asyncH(async (req, res) => res.json(engine.funcs().school_avoidance(req.body))));
router.post('/ocd', asyncH(async (req, res) => res.json(engine.funcs().ocd_exposure(req.body))));

module.exports = router;
