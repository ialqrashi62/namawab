// filepath: tier5_home_health_ext_105_telehealth_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_home_health_ext_105_telehealth_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/rpm', asyncH(async (req, res) => res.json(engine.funcs().chronic_rpm(req.body))));
router.post('/alert', asyncH(async (req, res) => res.json(engine.funcs().alert_triage(req.body))));
router.post('/chrontx', asyncH(async (req, res) => res.json(engine.funcs().chronic_disease_tele(req.body))));
router.post('/video', asyncH(async (req, res) => res.json(engine.funcs().video_visit_check(req.body))));
router.post('/inclusion', asyncH(async (req, res) => res.json(engine.funcs().digital_inclusion(req.body))));

module.exports = router;
