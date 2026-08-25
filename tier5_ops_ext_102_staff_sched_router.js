// filepath: tier5_ops_ext_102_staff_sched_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ops_ext_102_staff_sched_engine.js');

const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/hppd', asyncH(async (req, res) => res.json(engine.funcs().hppd(req.body))));
router.post('/ratio', asyncH(async (req, res) => res.json(engine.funcs().nurse_to_patient_ratio(req.body))));
router.post('/overtime', asyncH(async (req, res) => res.json(engine.funcs().overtime_fatigue(req.body))));
router.post('/skillmix', asyncH(async (req, res) => res.json(engine.funcs().skillmix_assess(req.body))));
router.post('/shift', asyncH(async (req, res) => res.json(engine.funcs().shift_assignment(req.body))));

module.exports = router;
