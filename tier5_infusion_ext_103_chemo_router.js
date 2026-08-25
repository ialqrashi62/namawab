// filepath: tier5_infusion_ext_103_chemo_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_infusion_ext_103_chemo_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pre', asyncH(async (req, res) => res.json(engine.funcs().chemo_pre(req.body))));
router.post('/ves', asyncH(async (req, res) => res.json(engine.funcs().chemo_vesicant(req.body))));
router.post('/emesis', asyncH(async (req, res) => res.json(engine.funcs().chemo_emesis(req.body))));
router.post('/hyp', asyncH(async (req, res) => res.json(engine.funcs().hypersensitivity(req.body))));
router.post('/disp', asyncH(async (req, res) => res.json(engine.funcs().chemo_disposal(req.body))));
router.post('/day', asyncH(async (req, res) => res.json(engine.funcs().chemo_cycle_day(req.body))));
module.exports = router;
