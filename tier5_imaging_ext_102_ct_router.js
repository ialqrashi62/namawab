// filepath: tier5_imaging_ext_102_ct_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_imaging_ext_102_ct_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/trauma', asyncH(async (req, res) => res.json(engine.funcs().trauma_ct(req.body))));
router.post('/pe', asyncH(async (req, res) => res.json(engine.funcs().ct_pulmonary_angiogram(req.body))));
router.post('/stroke', asyncH(async (req, res) => res.json(engine.funcs().stroke_ct(req.body))));
router.post('/cardiac', asyncH(async (req, res) => res.json(engine.funcs().cardiac_ct(req.body))));
router.post('/perfusion', asyncH(async (req, res) => res.json(engine.funcs().ct_perfusion(req.body))));
router.post('/lowdose', asyncH(async (req, res) => res.json(engine.funcs().low_dose_ct(req.body))));

module.exports = router;
