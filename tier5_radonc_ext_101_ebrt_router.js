// filepath: tier5_radonc_ext_101_ebrt_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_radonc_ext_101_ebrt_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/intent', asyncH(async (req, res) => res.json(engine.funcs().intent(req.body))));
router.post('/plan', asyncH(async (req, res) => res.json(engine.funcs().planning(req.body))));
router.post('/dose', asyncH(async (req, res) => res.json(engine.funcs().dose(req.body))));
router.post('/ig', asyncH(async (req, res) => res.json(engine.funcs().image_guided(req.body))));
router.post('/tx', asyncH(async (req, res) => res.json(engine.funcs().treatment(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
module.exports = router;