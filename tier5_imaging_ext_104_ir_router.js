// filepath: tier5_imaging_ext_104_ir_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_imaging_ext_104_ir_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/biopsy', asyncH(async (req, res) => res.json(engine.funcs().biopsy(req.body))));
router.post('/drain', asyncH(async (req, res) => res.json(engine.funcs().drain(req.body))));
router.post('/tips', asyncH(async (req, res) => res.json(engine.funcs().tips(req.body))));
router.post('/embol', asyncH(async (req, res) => res.json(engine.funcs().embolization(req.body))));
router.post('/ablate', asyncH(async (req, res) => res.json(engine.funcs().ablation(req.body))));
router.post('/stent', asyncH(async (req, res) => res.json(engine.funcs().stent(req.body))));

module.exports = router;
