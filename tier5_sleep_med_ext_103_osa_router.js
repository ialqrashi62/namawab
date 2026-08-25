// filepath: tier5_sleep_med_ext_103_osa_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_sleep_med_ext_103_osa_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/sev', asyncH(async (req, res) => res.json(engine.funcs().severity(req.body))));
router.post('/treat', asyncH(async (req, res) => res.json(engine.funcs().treatment(req.body))));
router.post('/surg', asyncH(async (req, res) => res.json(engine.funcs().surgery(req.body))));
router.post('/peri', asyncH(async (req, res) => res.json(engine.funcs().perioperative(req.body))));
router.post('/peds', asyncH(async (req, res) => res.json(engine.funcs().pediatric(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
module.exports = router;
