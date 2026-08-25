// filepath: tier5_public_health_ext_102_imm_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_public_health_ext_102_imm_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/sched', asyncH(async (req, res) => res.json(engine.funcs().schedule(req.body))));
router.post('/vac', asyncH(async (req, res) => res.json(engine.funcs().vaccinate(req.body))));
router.post('/obs', asyncH(async (req, res) => res.json(engine.funcs().observe(req.body))));
router.post('/sch', asyncH(async (req, res) => res.json(engine.funcs().school(req.body))));
router.post('/trv', asyncH(async (req, res) => res.json(engine.funcs().travel(req.body))));
router.post('/reg', asyncH(async (req, res) => res.json(engine.funcs().registry(req.body))));
module.exports = router;
