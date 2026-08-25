// filepath: tier5_quality_safety_ext_105_fmea_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_quality_safety_ext_105_fmea_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/sc', asyncH(async (req, res) => res.json(engine.funcs().scope(req.body))));
router.post('/st', asyncH(async (req, res) => res.json(engine.funcs().steps(req.body))));
router.post('/sr', asyncH(async (req, res) => res.json(engine.funcs().scoring(req.body))));
router.post('/mit', asyncH(async (req, res) => res.json(engine.funcs().mitigation(req.body))));
router.post('/out', asyncH(async (req, res) => res.json(engine.funcs().outcomes(req.body))));
router.post('/rep', asyncH(async (req, res) => res.json(engine.funcs().reporting(req.body))));
module.exports = router;
