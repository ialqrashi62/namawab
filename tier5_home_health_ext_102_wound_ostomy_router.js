// filepath: tier5_home_health_ext_102_wound_ostomy_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_home_health_ext_102_wound_ostomy_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/ostomy', asyncH(async (req, res) => res.json(engine.funcs().ostomy_pouch_select(req.body))));
router.post('/care', asyncH(async (req, res) => res.json(engine.funcs().wound_care_home(req.body))));
router.post('/heal', asyncH(async (req, res) => res.json(engine.funcs().wound_healing_curve(req.body))));
router.post('/cont', asyncH(async (req, res) => res.json(engine.funcs().continence_home(req.body))));
router.post('/virtual', asyncH(async (req, res) => res.json(engine.funcs().virtual_wound_consult(req.body))));

module.exports = router;
