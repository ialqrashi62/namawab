// filepath: tier5_lab_adv_ext_105_bb_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_lab_adv_ext_105_bb_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/apher', asyncH(async (req, res) => res.json(engine.funcs().therapeutic_apheresis(req.body))));
router.post('/hla', asyncH(async (req, res) => res.json(engine.funcs().hla_typing(req.body))));
router.post('/plt', asyncH(async (req, res) => res.json(engine.funcs().platelet_crossmatch(req.body))));
router.post('/exch', asyncH(async (req, res) => res.json(engine.funcs().exchange_transfusion(req.body))));
router.post('/neonat', asyncH(async (req, res) => res.json(engine.funcs().neonatal_transfusion(req.body))));
router.post('/hpc', asyncH(async (req, res) => res.json(engine.funcs().hpc_apheresis(req.body))));
module.exports = router;
