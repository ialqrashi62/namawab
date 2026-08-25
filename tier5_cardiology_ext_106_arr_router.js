// filepath: tier5_cardiology_ext_106_arr_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_cardiology_ext_106_arr_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/af', asyncH(async (req, res) => res.json(engine.funcs().afib(req.body))));
router.post('/afl', asyncH(async (req, res) => res.json(engine.funcs().aflutter(req.body))));
router.post('/svt', asyncH(async (req, res) => res.json(engine.funcs().svt(req.body))));
router.post('/vt', asyncH(async (req, res) => res.json(engine.funcs().vt(req.body))));
router.post('/bra', asyncH(async (req, res) => res.json(engine.funcs().brady(req.body))));
router.post('/abl', asyncH(async (req, res) => res.json(engine.funcs().ablation(req.body))));
module.exports = router;
