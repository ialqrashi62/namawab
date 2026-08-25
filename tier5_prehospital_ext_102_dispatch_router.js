// filepath: tier5_prehospital_ext_102_dispatch_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_prehospital_ext_102_dispatch_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pri', asyncH(async (req, res) => res.json(engine.funcs().priority(req.body))));
router.post('/res', asyncH(async (req, res) => res.json(engine.funcs().resource(req.body))));
router.post('/prep', asyncH(async (req, res) => res.json(engine.funcs().prep_instructions(req.body))));
router.post('/loc', asyncH(async (req, res) => res.json(engine.funcs().location(req.body))));
router.post('/call', asyncH(async (req, res) => res.json(engine.funcs().caller_support(req.body))));
router.post('/saf', asyncH(async (req, res) => res.json(engine.funcs().staff_safety(req.body))));
module.exports = router;
