// filepath: tier5_quality_safety_ext_101_cqi_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_quality_safety_ext_101_cqi_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pdca', asyncH(async (req, res) => res.json(engine.funcs().pdca(req.body))));
router.post('/aim', asyncH(async (req, res) => res.json(engine.funcs().aim(req.body))));
router.post('/meas', asyncH(async (req, res) => res.json(engine.funcs().measures(req.body))));
router.post('/test', asyncH(async (req, res) => res.json(engine.funcs().tests(req.body))));
router.post('/spr', asyncH(async (req, res) => res.json(engine.funcs().spread(req.body))));
router.post('/dash', asyncH(async (req, res) => res.json(engine.funcs().dashboard(req.body))));
module.exports = router;
