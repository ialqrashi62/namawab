// filepath: tier5_pain_ext_103_cancer_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pain_ext_103_cancer_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/ladder', asyncH(async (req, res) => res.json(engine.funcs().who_ladder(req.body))));
router.post('/rotation', asyncH(async (req, res) => res.json(engine.funcs().opioid_rotation(req.body))));
router.post('/breakthru', asyncH(async (req, res) => res.json(engine.funcs().breakthrough(req.body))));
router.post('/side', asyncH(async (req, res) => res.json(engine.funcs().side_effect_manage(req.body))));
router.post('/intev', asyncH(async (req, res) => res.json(engine.funcs().interventional(req.body))));

module.exports = router;
