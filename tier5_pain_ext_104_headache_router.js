// filepath: tier5_pain_ext_104_headache_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pain_ext_104_headache_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/classify', asyncH(async (req, res) => res.json(engine.funcs().classify(req.body))));
router.post('/redflags', asyncH(async (req, res) => res.json(engine.funcs().red_flags(req.body))));
router.post('/abortive', asyncH(async (req, res) => res.json(engine.funcs().abortive(req.body))));
router.post('/prevent', asyncH(async (req, res) => res.json(engine.funcs().preventive(req.body))));
router.post('/peds', asyncH(async (req, res) => res.json(engine.funcs().pediatric(req.body))));

module.exports = router;
