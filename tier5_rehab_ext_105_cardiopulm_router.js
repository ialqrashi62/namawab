// filepath: tier5_rehab_ext_105_cardiopulm_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rehab_ext_105_cardiopulm_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/risk', asyncH(async (req, res) => res.json(engine.funcs().cpr_stratification(req.body))));
router.post('/mets', asyncH(async (req, res) => res.json(engine.funcs().exercise_capacity(req.body))));
router.post('/rpe', asyncH(async (req, res) => res.json(engine.funcs().rpe_target(req.body))));
router.post('/phase2', asyncH(async (req, res) => res.json(engine.funcs().phase2_protocol(req.body))));
router.post('/pulre', asyncH(async (req, res) => res.json(engine.funcs().pulmonary_rehab(req.body))));

module.exports = router;
