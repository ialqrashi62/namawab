// filepath: tier5_pmrehab_ext_106_ped_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pmrehab_ext_106_ped_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/assess', asyncH(async (req, res) => res.json(engine.funcs().assess(req.body))));
router.post('/fam', asyncH(async (req, res) => res.json(engine.funcs().family(req.body))));
router.post('/non', asyncH(async (req, res) => res.json(engine.funcs().nonpharm(req.body))));
router.post('/ac', asyncH(async (req, res) => res.json(engine.funcs().acute(req.body))));
router.post('/chr', asyncH(async (req, res) => res.json(engine.funcs().chronic(req.body))));
router.post('/sch', asyncH(async (req, res) => res.json(engine.funcs().school(req.body))));
module.exports = router;