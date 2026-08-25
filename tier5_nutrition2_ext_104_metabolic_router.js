// filepath: tier5_nutrition2_ext_104_metabolic_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_nutrition2_ext_104_metabolic_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pku', asyncH(async (req, res) => res.json(engine.funcs().pku(req.body))));
router.post('/mps', asyncH(async (req, res) => res.json(engine.funcs().mps(req.body))));
router.post('/fao', asyncH(async (req, res) => res.json(engine.funcs().fatty_acid(req.body))));
router.post('/ucd', asyncH(async (req, res) => res.json(engine.funcs().urea_cycle(req.body))));
router.post('/storage', asyncH(async (req, res) => res.json(engine.funcs().storage_disease(req.body))));
router.post('/oa', asyncH(async (req, res) => res.json(engine.funcs().organic_acidemia(req.body))));
module.exports = router;
