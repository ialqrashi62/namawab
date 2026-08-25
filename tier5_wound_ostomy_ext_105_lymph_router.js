// filepath: tier5_wound_ostomy_ext_105_lymph_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_wound_ostomy_ext_105_lymph_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/stage', asyncH(async (req, res) => res.json(engine.funcs().staging(req.body))));
router.post('/cdt', asyncH(async (req, res) => res.json(engine.funcs().cdt(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().compression(req.body))));
router.post('/ex', asyncH(async (req, res) => res.json(engine.funcs().exercise(req.body))));
router.post('/meas', asyncH(async (req, res) => res.json(engine.funcs().measurements(req.body))));
router.post('/cell', asyncH(async (req, res) => res.json(engine.funcs().cellulitis(req.body))));
module.exports = router;
