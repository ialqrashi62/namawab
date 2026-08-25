// filepath: tier5_psych_ext_104_bipolar_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_psych_ext_104_bipolar_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/ymrs', asyncH(async (req, res) => res.json(engine.funcs().ymrs(req.body))));
router.post('/mixed', asyncH(async (req, res) => res.json(engine.funcs().mixed_features(req.body))));
router.post('/lithium', asyncH(async (req, res) => res.json(engine.funcs().lithium_dosing(req.body))));
router.post('/ad-steering', asyncH(async (req, res) => res.json(engine.funcs().antidepressant_steering(req.body))));
router.post('/pregnancy', asyncH(async (req, res) => res.json(engine.funcs().pregnancy_lithium(req.body))));

module.exports = router;
