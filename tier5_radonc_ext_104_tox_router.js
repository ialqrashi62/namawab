// filepath: tier5_radonc_ext_104_tox_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_radonc_ext_104_tox_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/grade', asyncH(async (req, res) => res.json(engine.funcs().grade(req.body))));
router.post('/skin', asyncH(async (req, res) => res.json(engine.funcs().skin(req.body))));
router.post('/muc', asyncH(async (req, res) => res.json(engine.funcs().mucositis(req.body))));
router.post('/pne', asyncH(async (req, res) => res.json(engine.funcs().pneumonitis(req.body))));
router.post('/late', asyncH(async (req, res) => res.json(engine.funcs().late(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
module.exports = router;