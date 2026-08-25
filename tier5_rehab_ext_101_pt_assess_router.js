// filepath: tier5_rehab_ext_101_pt_assess_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rehab_ext_101_pt_assess_engine.js');

const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/fim', asyncH(async (req, res) => res.json(engine.funcs().fim_total(req.body))));
router.post('/berg', asyncH(async (req, res) => res.json(engine.funcs().berg_balance(req.body))));
router.post('/walk', asyncH(async (req, res) => res.json(engine.funcs().six_min_walk(req.body))));
router.post('/mrc', asyncH(async (req, res) => res.json(engine.funcs().mrc_strength(req.body))));
router.post('/discharge', asyncH(async (req, res) => res.json(engine.funcs().educate_home_program(req.body))));

module.exports = router;
