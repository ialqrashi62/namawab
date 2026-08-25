// filepath: tier5_pmrehab_ext_103_sci_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pmrehab_ext_103_sci_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/asia', asyncH(async (req, res) => res.json(engine.funcs().asia_assess(req.body))));
router.post('/blad', asyncH(async (req, res) => res.json(engine.funcs().bladder(req.body))));
router.post('/bow', asyncH(async (req, res) => res.json(engine.funcs().bowel(req.body))));
router.post('/dvt', asyncH(async (req, res) => res.json(engine.funcs().dvt_prevention(req.body))));
router.post('/spas', asyncH(async (req, res) => res.json(engine.funcs().spasticity(req.body))));
router.post('/seat', asyncH(async (req, res) => res.json(engine.funcs().wheelchair_seating(req.body))));
module.exports = router;
