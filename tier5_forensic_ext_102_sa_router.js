// filepath: tier5_forensic_ext_102_sa_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_forensic_ext_102_sa_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/history', asyncH(async (req, res) => res.json(engine.funcs().sa_history(req.body))));
router.post('/exam', asyncH(async (req, res) => res.json(engine.funcs().sa_exam(req.body))));
router.post('/specimens', asyncH(async (req, res) => res.json(engine.funcs().sa_specimens(req.body))));
router.post('/safety', asyncH(async (req, res) => res.json(engine.funcs().sa_safety(req.body))));
router.post('/prophylaxis', asyncH(async (req, res) => res.json(engine.funcs().sa_prophylaxis(req.body))));

module.exports = router;
