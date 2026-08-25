// filepath: tier5_dental_ext_105_oral_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_dental_ext_105_oral_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/extract', asyncH(async (req, res) => res.json(engine.funcs().extraction(req.body))));
router.post('/m3', asyncH(async (req, res) => res.json(engine.funcs().impacted_third_molar(req.body))));
router.post('/biopsy', asyncH(async (req, res) => res.json(engine.funcs().biopsy(req.body))));
router.post('/trauma', asyncH(async (req, res) => res.json(engine.funcs().facial_trauma(req.body))));
router.post('/orthogn', asyncH(async (req, res) => res.json(engine.funcs().orthognathic_surgery(req.body))));
router.post('/distract', asyncH(async (req, res) => res.json(engine.funcs().distraction(req.body))));

module.exports = router;
