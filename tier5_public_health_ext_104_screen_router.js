// filepath: tier5_public_health_ext_104_screen_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_public_health_ext_104_screen_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/crit', asyncH(async (req, res) => res.json(engine.funcs().criteria(req.body))));
router.post('/adh', asyncH(async (req, res) => res.json(engine.funcs().adherence(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().followUp(req.body))));
router.post('/reg', asyncH(async (req, res) => res.json(engine.funcs().registry(req.body))));
router.post('/prog', asyncH(async (req, res) => res.json(engine.funcs().program(req.body))));
router.post('/sp', asyncH(async (req, res) => res.json(engine.funcs().specialPop(req.body))));
module.exports = router;
