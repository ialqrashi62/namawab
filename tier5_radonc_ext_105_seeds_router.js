// filepath: tier5_radonc_ext_105_seeds_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_radonc_ext_105_seeds_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/eval', asyncH(async (req, res) => res.json(engine.funcs().evaluation(req.body))));
router.post('/plan', asyncH(async (req, res) => res.json(engine.funcs().planning(req.body))));
router.post('/proc', asyncH(async (req, res) => res.json(engine.funcs().procedure(req.body))));
router.post('/po', asyncH(async (req, res) => res.json(engine.funcs().post_op(req.body))));
router.post('/tox', asyncH(async (req, res) => res.json(engine.funcs().tox(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
module.exports = router;