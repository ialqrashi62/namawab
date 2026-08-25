// filepath: tier5_sleep_med_ext_106_peds_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_sleep_med_ext_106_peds_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/assess', asyncH(async (req, res) => res.json(engine.funcs().peds_assessment(req.body))));
router.post('/sched', asyncH(async (req, res) => res.json(engine.funcs().sleep_schedule(req.body))));
router.post('/nw', asyncH(async (req, res) => res.json(engine.funcs().night_wakings(req.body))));
router.post('/ton', asyncH(async (req, res) => res.json(engine.funcs().apnea_tonsil(req.body))));
router.post('/meds', asyncH(async (req, res) => res.json(engine.funcs().sleep_meds(req.body))));
router.post('/sch', asyncH(async (req, res) => res.json(engine.funcs().school_performance(req.body))));
module.exports = router;
