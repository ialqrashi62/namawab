// filepath: tier5_cardiology_ext_102_stress_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_cardiology_ext_102_stress_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ind', asyncH(async (req, res) => res.json(engine.funcs().indications(req.body))));
router.post('/con', asyncH(async (req, res) => res.json(engine.funcs().contraindications(req.body))));
router.post('/pro', asyncH(async (req, res) => res.json(engine.funcs().protocol(req.body))));
router.post('/res', asyncH(async (req, res) => res.json(engine.funcs().results(req.body))));
router.post('/rec', asyncH(async (req, res) => res.json(engine.funcs().recovery(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
module.exports = router;
