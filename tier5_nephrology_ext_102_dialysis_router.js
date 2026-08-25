// filepath: tier5_nephrology_ext_102_dialysis_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_nephrology_ext_102_dialysis_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/adq', asyncH(async (req, res) => res.json(engine.funcs().adequacy(req.body))));
router.post('/acc', asyncH(async (req, res) => res.json(engine.funcs().access(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
router.post('/dw', asyncH(async (req, res) => res.json(engine.funcs().dry_weight(req.body))));
router.post('/peri', asyncH(async (req, res) => res.json(engine.funcs().peritonitis(req.body))));
router.post('/pres', asyncH(async (req, res) => res.json(engine.funcs().prescription(req.body))));
module.exports = router;