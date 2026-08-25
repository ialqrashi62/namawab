// filepath: tier5_pain_ext_106_eol_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pain_ext_106_eol_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/nausea', asyncH(async (req, res) => res.json(engine.funcs().nausea(req.body))));
router.post('/bowel', asyncH(async (req, res) => res.json(engine.funcs().bowel_obstruction(req.body))));
router.post('/oral', asyncH(async (req, res) => res.json(engine.funcs().oral_care(req.body))));
router.post('/resp', asyncH(async (req, res) => res.json(engine.funcs().respiratory_congestion(req.body))));
router.post('/anxiety', asyncH(async (req, res) => res.json(engine.funcs().antianxiety(req.body))));

module.exports = router;
