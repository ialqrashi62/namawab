// filepath: tier5_pharm_ext_101_recon_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pharm_ext_101_recon_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/in', asyncH(async (req, res) => res.json(engine.funcs().intake(req.body))));
router.post('/dis', asyncH(async (req, res) => res.json(engine.funcs().discrepancies(req.body))));
router.post('/tx', asyncH(async (req, res) => res.json(engine.funcs().transmission(req.body))));
router.post('/trans', asyncH(async (req, res) => res.json(engine.funcs().transitions(req.body))));
router.post('/hr', asyncH(async (req, res) => res.json(engine.funcs().high_risk(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
module.exports = router;