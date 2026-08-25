// filepath: tier5_rehab_med_ext_102_sports_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rehab_med_ext_102_sports_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/inj', asyncH(async (req, res) => res.json(engine.funcs().injury(req.body))));
router.post('/pre', asyncH(async (req, res) => res.json(engine.funcs().pre_participation(req.body))));
router.post('/conc', asyncH(async (req, res) => res.json(engine.funcs().concussion(req.body))));
router.post('/rtp', asyncH(async (req, res) => res.json(engine.funcs().rtp(req.body))));
router.post('/load', asyncH(async (req, res) => res.json(engine.funcs().training_load(req.body))));
router.post('/prev', asyncH(async (req, res) => res.json(engine.funcs().prevention(req.body))));
module.exports = router;
