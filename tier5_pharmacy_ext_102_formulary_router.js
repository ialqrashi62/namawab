// filepath: tier5_pharmacy_ext_102_formulary_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pharmacy_ext_102_formulary_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/formulary', asyncH(async (req, res) => res.json(engine.funcs().check_formulary(req.body))));
router.post('/interaction', asyncH(async (req, res) => res.json(engine.funcs().check_interaction(req.body))));
router.post('/ivcompat', asyncH(async (req, res) => res.json(engine.funcs().iv_compatibility(req.body))));
router.post('/dose', asyncH(async (req, res) => res.json(engine.funcs().dose_check(req.body))));
router.post('/info', asyncH(async (req, res) => res.json(engine.funcs().drug_info_lookup(req.body))));

module.exports = router;
