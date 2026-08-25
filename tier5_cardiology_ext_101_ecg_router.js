// filepath: tier5_cardiology_ext_101_ecg_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_cardiology_ext_101_ecg_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/rhy', asyncH(async (req, res) => res.json(engine.funcs().rhythm(req.body))));
router.post('/int', asyncH(async (req, res) => res.json(engine.funcs().intervals(req.body))));
router.post('/st', asyncH(async (req, res) => res.json(engine.funcs().st_changes(req.body))));
router.post('/q', asyncH(async (req, res) => res.json(engine.funcs().q_waves(req.body))));
router.post('/ax', asyncH(async (req, res) => res.json(engine.funcs().axis(req.body))));
router.post('/bbb', asyncH(async (req, res) => res.json(engine.funcs().bbb(req.body))));
module.exports = router;
