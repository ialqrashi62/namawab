// filepath: tier5_radonc_ext_103_brachy_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_radonc_ext_103_brachy_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ind', asyncH(async (req, res) => res.json(engine.funcs().indication(req.body))));
router.post('/plan', asyncH(async (req, res) => res.json(engine.funcs().planning(req.body))));
router.post('/del', asyncH(async (req, res) => res.json(engine.funcs().delivery(req.body))));
router.post('/pros', asyncH(async (req, res) => res.json(engine.funcs().prostate(req.body))));
router.post('/cx', asyncH(async (req, res) => res.json(engine.funcs().cervix(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
module.exports = router;