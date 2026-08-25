// filepath: tier5_quality_safety_ext_102_safety_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_quality_safety_ext_102_safety_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/sc', asyncH(async (req, res) => res.json(engine.funcs().safety_culture(req.body))));
router.post('/c2c', asyncH(async (req, res) => res.json(engine.funcs().ihi_two_challenge(req.body))));
router.post('/crew', asyncH(async (req, res) => res.json(engine.funcs().crew(req.body))));
router.post('/sr', asyncH(async (req, res) => res.json(engine.funcs().safety_rounds(req.body))));
router.post('/hnd', asyncH(async (req, res) => res.json(engine.funcs().handoff(req.body))));
router.post('/up', asyncH(async (req, res) => res.json(engine.funcs().universal_protocol(req.body))));
module.exports = router;
