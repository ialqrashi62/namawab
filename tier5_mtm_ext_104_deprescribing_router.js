// filepath: tier5_mtm_ext_104_deprescribing_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_mtm_ext_104_deprescribing_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/beers', asyncH(async (req, res) => res.json(engine.funcs().beers_criteria(req.body))));
router.post('/stopp', asyncH(async (req, res) => res.json(engine.funcs().stopp_start(req.body))));
router.post('/reduce', asyncH(async (req, res) => res.json(engine.funcs().dose_reduction(req.body))));
router.post('/switch', asyncH(async (req, res) => res.json(engine.funcs().drug_switch(req.body))));
router.post('/taper', asyncH(async (req, res) => res.json(engine.funcs().taper(req.body))));
router.post('/dcssx', asyncH(async (req, res) => res.json(engine.funcs().discontinuation_symptom(req.body))));

module.exports = router;
