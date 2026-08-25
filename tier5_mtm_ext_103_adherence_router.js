// filepath: tier5_mtm_ext_103_adherence_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_mtm_ext_103_adherence_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/morisky', asyncH(async (req, res) => res.json(engine.funcs().morisky(req.body))));
router.post('/pillcount', asyncH(async (req, res) => res.json(engine.funcs().pill_count(req.body))));
router.post('/refill', asyncH(async (req, res) => res.json(engine.funcs().refill(req.body))));
router.post('/barriers', asyncH(async (req, res) => res.json(engine.funcs().barriers(req.body))));
router.post('/followup', asyncH(async (req, res) => res.json(engine.funcs().followup_plan(req.body))));
router.post('/trend', asyncH(async (req, res) => res.json(engine.funcs().adherence_trend(req.body))));

module.exports = router;
