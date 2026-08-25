// filepath: tier5_quality_safety_ext_106_sentinel_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_quality_safety_ext_106_sentinel_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/det', asyncH(async (req, res) => res.json(engine.funcs().detection(req.body))));
router.post('/rev', asyncH(async (req, res) => res.json(engine.funcs().review(req.body))));
router.post('/rca', asyncH(async (req, res) => res.json(engine.funcs().rca(req.body))));
router.post('/act', asyncH(async (req, res) => res.json(engine.funcs().action_plan(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
router.post('/rep', asyncH(async (req, res) => res.json(engine.funcs().reporting(req.body))));
module.exports = router;
