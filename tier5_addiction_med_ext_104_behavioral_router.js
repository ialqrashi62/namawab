// filepath: tier5_addiction_med_ext_104_behavioral_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_addiction_med_ext_104_behavioral_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/cbt', asyncH(async (req, res) => res.json(engine.funcs().cbt(req.body))));
router.post('/cm', asyncH(async (req, res) => res.json(engine.funcs().cm(req.body))));
router.post('/mi', asyncH(async (req, res) => res.json(engine.funcs().mi(req.body))));
router.post('/12', asyncH(async (req, res) => res.json(engine.funcs().twelve_step(req.body))));
router.post('/fam', asyncH(async (req, res) => res.json(engine.funcs().family(req.body))));
router.post('/prel', asyncH(async (req, res) => res.json(engine.funcs().relapse(req.body))));
module.exports = router;
