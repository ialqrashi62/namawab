// filepath: tier5_sleep_med_ext_101_sleep_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_sleep_med_ext_101_sleep_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/init', asyncH(async (req, res) => res.json(engine.funcs().initial_assessment(req.body))));
router.post('/study', asyncH(async (req, res) => res.json(engine.funcs().sleep_study(req.body))));
router.post('/cpap', asyncH(async (req, res) => res.json(engine.funcs().cpap(req.body))));
router.post('/ins', asyncH(async (req, res) => res.json(engine.funcs().insomnia(req.body))));
router.post('/circ', asyncH(async (req, res) => res.json(engine.funcs().circadian(req.body))));
router.post('/para', asyncH(async (req, res) => res.json(engine.funcs().parasomnia(req.body))));
module.exports = router;
