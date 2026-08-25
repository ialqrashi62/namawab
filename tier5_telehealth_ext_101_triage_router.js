// filepath: tier5_telehealth_ext_101_triage_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_telehealth_ext_101_triage_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/t', asyncH(async (req, res) => res.json(engine.funcs().triage(req.body))));
router.post('/safe', asyncH(async (req, res) => res.json(engine.funcs().safety_check(req.body))));
router.post('/sym', asyncH(async (req, res) => res.json(engine.funcs().symptom(req.body))));
router.post('/doc', asyncH(async (req, res) => res.json(engine.funcs().documentation(req.body))));
router.post('/disp', asyncH(async (req, res) => res.json(engine.funcs().disposition(req.body))));
router.post('/esc', asyncH(async (req, res) => res.json(engine.funcs().escalation(req.body))));
module.exports = router;
