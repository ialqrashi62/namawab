// filepath: tier5_pall_care_ext_105_lastdays_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pall_care_ext_105_lastdays_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/dying', asyncH(async (req, res) => res.json(engine.funcs().dying_process(req.body))));
router.post('/terminal', asyncH(async (req, res) => res.json(engine.funcs().terminal_symptoms(req.body))));
router.post('/wdl', asyncH(async (req, res) => res.json(engine.funcs().withdrawal_care(req.body))));
router.post('/dignity', asyncH(async (req, res) => res.json(engine.funcs().dignity_care(req.body))));
router.post('/mortem', asyncH(async (req, res) => res.json(engine.funcs().post_mortem(req.body))));
router.post('/vigil', asyncH(async (req, res) => res.json(engine.funcs().vigil_care(req.body))));
module.exports = router;
