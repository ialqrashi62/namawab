// filepath: tier5_radonc_ext_102_srs_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_radonc_ext_102_srs_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ind', asyncH(async (req, res) => res.json(engine.funcs().indication(req.body))));
router.post('/plan', asyncH(async (req, res) => res.json(engine.funcs().planning(req.body))));
router.post('/dose', asyncH(async (req, res) => res.json(engine.funcs().dose(req.body))));
router.post('/del', asyncH(async (req, res) => res.json(engine.funcs().delivery(req.body))));
router.post('/bm', asyncH(async (req, res) => res.json(engine.funcs().brain_met(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
module.exports = router;