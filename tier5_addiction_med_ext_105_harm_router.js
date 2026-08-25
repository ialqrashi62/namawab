// filepath: tier5_addiction_med_ext_105_harm_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_addiction_med_ext_105_harm_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/oxn', asyncH(async (req, res) => res.json(engine.funcs().naloxone(req.body))));
router.post('/syrp', asyncH(async (req, res) => res.json(engine.funcs().syrp(req.body))));
router.post('/sinj', asyncH(async (req, res) => res.json(engine.funcs().safe_inject(req.body))));
router.post('/sex', asyncH(async (req, res) => res.json(engine.funcs().sex_hr(req.body))));
router.post('/hous', asyncH(async (req, res) => res.json(engine.funcs().housing(req.body))));
router.post('/fts', asyncH(async (req, res) => res.json(engine.funcs().fts(req.body))));
module.exports = router;
