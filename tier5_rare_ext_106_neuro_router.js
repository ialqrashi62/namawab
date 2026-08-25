// filepath: tier5_rare_ext_106_neuro_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rare_ext_106_neuro_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/huntington', asyncH(async (req, res) => res.json(engine.funcs().huntington_test(req.body))));
router.post('/als', asyncH(async (req, res) => res.json(engine.funcs().als_score(req.body))));
router.post('/sma', asyncH(async (req, res) => res.json(engine.funcs().sma_management(req.body))));
router.post('/dmd', asyncH(async (req, res) => res.json(engine.funcs().dmd_classification(req.body))));
router.post('/ataxia', asyncH(async (req, res) => res.json(engine.funcs().ataxia_screen(req.body))));

module.exports = router;
