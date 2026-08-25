// filepath: tier5_pharm_ext_105_peds_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pharm_ext_105_peds_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/wt', asyncH(async (req, res) => res.json(engine.funcs().weight_dosing(req.body))));
router.post('/dev', asyncH(async (req, res) => res.json(engine.funcs().developmental(req.body))));
router.post('/form', asyncH(async (req, res) => res.json(engine.funcs().formulations(req.body))));
router.post('/bm', asyncH(async (req, res) => res.json(engine.funcs().breast_milk(req.body))));
router.post('/neo', asyncH(async (req, res) => res.json(engine.funcs().neonatal(req.body))));
router.post('/ol', asyncH(async (req, res) => res.json(engine.funcs().off_label(req.body))));
module.exports = router;