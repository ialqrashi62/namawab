// filepath: tier5_labauto_ext_102_chem_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_labauto_ext_102_chem_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/an', asyncH(async (req, res) => res.json(engine.funcs().analyzer(req.body))));
router.post('/qc', asyncH(async (req, res) => res.json(engine.funcs().qc(req.body))));
router.post('/cal', asyncH(async (req, res) => res.json(engine.funcs().calibration(req.body))));
router.post('/crit', asyncH(async (req, res) => res.json(engine.funcs().critical(req.body))));
router.post('/delta', asyncH(async (req, res) => res.json(engine.funcs().delta(req.body))));
router.post('/ref', asyncH(async (req, res) => res.json(engine.funcs().reference(req.body))));
module.exports = router;