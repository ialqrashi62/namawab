// filepath: tier5_home_health_ext_103_home_infusion_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_home_health_ext_103_home_infusion_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/abx', asyncH(async (req, res) => res.json(engine.funcs().antibiotic_home(req.body))));
router.post('/tpn', asyncH(async (req, res) => res.json(engine.funcs().tpn_home(req.body))));
router.post('/ivig', asyncH(async (req, res) => res.json(engine.funcs().ivig_home(req.body))));
router.post('/pump', asyncH(async (req, res) => res.json(engine.funcs().pump_alarm(req.body))));
router.post('/line', asyncH(async (req, res) => res.json(engine.funcs().line_care(req.body))));

module.exports = router;
