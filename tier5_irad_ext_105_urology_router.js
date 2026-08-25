// filepath: tier5_irad_ext_105_urology_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_irad_ext_105_urology_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pcn', asyncH(async (req, res) => res.json(engine.funcs().pcn(req.body))));
router.post('/stone', asyncH(async (req, res) => res.json(engine.funcs().stone(req.body))));
router.post('/prost', asyncH(async (req, res) => res.json(engine.funcs().prostate(req.body))));
router.post('/uter', asyncH(async (req, res) => res.json(engine.funcs().uterine(req.body))));
router.post('/var', asyncH(async (req, res) => res.json(engine.funcs().varicocele(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
module.exports = router;