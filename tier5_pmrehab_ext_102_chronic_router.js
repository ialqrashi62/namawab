// filepath: tier5_pmrehab_ext_102_chronic_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pmrehab_ext_102_chronic_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/assess', asyncH(async (req, res) => res.json(engine.funcs().assess(req.body))));
router.post('/nono', asyncH(async (req, res) => res.json(engine.funcs().nonopioid(req.body))));
router.post('/op', asyncH(async (req, res) => res.json(engine.funcs().opioid(req.body))));
router.post('/np', asyncH(async (req, res) => res.json(engine.funcs().nonpharm(req.body))));
router.post('/risk', asyncH(async (req, res) => res.json(engine.funcs().risk(req.body))));
router.post('/tap', asyncH(async (req, res) => res.json(engine.funcs().taper(req.body))));
module.exports = router;