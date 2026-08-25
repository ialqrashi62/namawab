// filepath: tier5_pain_ext_101_chronic_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pain_ext_101_chronic_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/biopsychosocial', asyncH(async (req, res) => res.json(engine.funcs().biopsychosocial(req.body))));
router.post('/func', asyncH(async (req, res) => res.json(engine.funcs().functional_outcome(req.body))));
router.post('/med', asyncH(async (req, res) => res.json(engine.funcs().pharmacologic_choice(req.body))));
router.post('/rehab', asyncH(async (req, res) => res.json(engine.funcs().multimodal_rehab(req.body))));
router.post('/step', asyncH(async (req, res) => res.json(engine.funcs().step_care(req.body))));

module.exports = router;
