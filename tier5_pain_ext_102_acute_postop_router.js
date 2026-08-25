// filepath: tier5_pain_ext_102_acute_postop_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pain_ext_102_acute_postop_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/pmra', asyncH(async (req, res) => res.json(engine.funcs().pmra_intensity(req.body))));
router.post('/eras', asyncH(async (req, res) => res.json(engine.funcs().enhanced_recovery(req.body))));
router.post('/block', asyncH(async (req, res) => res.json(engine.funcs().nerve_block_check(req.body))));
router.post('/pca', asyncH(async (req, res) => res.json(engine.funcs().patient_controlled(req.body))));
router.post('/ob', asyncH(async (req, res) => res.json(engine.funcs().ob_analgesia(req.body))));

module.exports = router;
