// filepath: tier5_sleep_med_ext_104_narcolepsy_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_sleep_med_ext_104_narcolepsy_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/dx', asyncH(async (req, res) => res.json(engine.funcs().diagnosis(req.body))));
router.post('/cat', asyncH(async (req, res) => res.json(engine.funcs().cataplexy(req.body))));
router.post('/pharm', asyncH(async (req, res) => res.json(engine.funcs().pharmacotherapy(req.body))));
router.post('/beh', asyncH(async (req, res) => res.json(engine.funcs().behavioral(req.body))));
router.post('/safe', asyncH(async (req, res) => res.json(engine.funcs().safety(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
module.exports = router;
