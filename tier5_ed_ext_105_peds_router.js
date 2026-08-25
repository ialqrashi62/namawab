// filepath: tier5_ed_ext_105_peds_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ed_ext_105_peds_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/pews', asyncH(async (req, res) => res.json(engine.funcs().pews(req.body))));
router.post('/dose', asyncH(async (req, res) => res.json(engine.funcs().age_dosing(req.body))));
router.post('/airway', asyncH(async (req, res) => res.json(engine.funcs().pediatric_airway(req.body))));
router.post('/resus', asyncH(async (req, res) => res.json(engine.funcs().pediatric_resus(req.body))));
router.post('/sepsis', asyncH(async (req, res) => res.json(engine.funcs().pediatric_sepsis(req.body))));
router.post('/trauma', asyncH(async (req, res) => res.json(engine.funcs().pediatric_trauma(req.body))));

module.exports = router;
