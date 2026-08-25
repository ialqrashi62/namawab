// filepath: tier5_addiction_med_ext_102_detox_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_addiction_med_ext_102_detox_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ciwa', asyncH(async (req, res) => res.json(engine.funcs().ciwa(req.body))));
router.post('/cows', asyncH(async (req, res) => res.json(engine.funcs().cows(req.body))));
router.post('/benzo', asyncH(async (req, res) => res.json(engine.funcs().benzo(req.body))));
router.post('/alc', asyncH(async (req, res) => res.json(engine.funcs().alc_med(req.body))));
router.post('/op', asyncH(async (req, res) => res.json(engine.funcs().opioid_med(req.body))));
router.post('/set', asyncH(async (req, res) => res.json(engine.funcs().setting(req.body))));
module.exports = router;
