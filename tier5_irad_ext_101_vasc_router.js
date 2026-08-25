// filepath: tier5_irad_ext_101_vasc_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_irad_ext_101_vasc_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pad', asyncH(async (req, res) => res.json(engine.funcs().pad(req.body))));
router.post('/dvt', asyncH(async (req, res) => res.json(engine.funcs().dvt(req.body))));
router.post('/ang', asyncH(async (req, res) => res.json(engine.funcs().angiogram(req.body))));
router.post('/plasty', asyncH(async (req, res) => res.json(engine.funcs().angioplasty(req.body))));
router.post('/emb', asyncH(async (req, res) => res.json(engine.funcs().embolization(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
module.exports = router;