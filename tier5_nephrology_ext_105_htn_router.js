// filepath: tier5_nephrology_ext_105_htn_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_nephrology_ext_105_htn_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/class', asyncH(async (req, res) => res.json(engine.funcs().htn_classify(req.body))));
router.post('/sec', asyncH(async (req, res) => res.json(engine.funcs().secondary(req.body))));
router.post('/tx', asyncH(async (req, res) => res.json(engine.funcs().treatment(req.body))));
router.post('/elec', asyncH(async (req, res) => res.json(engine.funcs().electrolytes(req.body))));
router.post('/ab', asyncH(async (req, res) => res.json(engine.funcs().acidbase(req.body))));
router.post('/stones', asyncH(async (req, res) => res.json(engine.funcs().nephrolithiasis(req.body))));
module.exports = router;