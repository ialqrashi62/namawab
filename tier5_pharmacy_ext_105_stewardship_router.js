// filepath: tier5_pharmacy_ext_105_stewardship_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pharmacy_ext_105_stewardship_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/warfarin', asyncH(async (req, res) => res.json(engine.funcs().warfarin_inr(req.body))));
router.post('/doac', asyncH(async (req, res) => res.json(engine.funcs().doac_renal(req.body))));
router.post('/abx', asyncH(async (req, res) => res.json(engine.funcs().antimicrobial_stewardship(req.body))));
router.post('/insulin', asyncH(async (req, res) => res.json(engine.funcs().insulin_protocol(req.body))));
router.post('/almperi', asyncH(async (req, res) => res.json(engine.funcs().almperi_stewardship(req.body))));

module.exports = router;
