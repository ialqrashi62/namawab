// filepath: tier5_rehab_med_ext_106_pelvic_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rehab_med_ext_106_pelvic_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/inc', asyncH(async (req, res) => res.json(engine.funcs().incontinence(req.body))));
router.post('/pf', asyncH(async (req, res) => res.json(engine.funcs().pelvic_floor(req.body))));
router.post('/bf', asyncH(async (req, res) => res.json(engine.funcs().biofeedback(req.body))));
router.post('/prl', asyncH(async (req, res) => res.json(engine.funcs().prolapse(req.body))));
router.post('/pain', asyncH(async (req, res) => res.json(engine.funcs().pelvic_pain(req.body))));
router.post('/peds', asyncH(async (req, res) => res.json(engine.funcs().pediatric(req.body))));
module.exports = router;
