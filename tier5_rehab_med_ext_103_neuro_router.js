// filepath: tier5_rehab_med_ext_103_neuro_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rehab_med_ext_103_neuro_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/strk', asyncH(async (req, res) => res.json(engine.funcs().stroke_assessment(req.body))));
router.post('/tbi', asyncH(async (req, res) => res.json(engine.funcs().tbi(req.body))));
router.post('/sci', asyncH(async (req, res) => res.json(engine.funcs().spinal_cord(req.body))));
router.post('/ms', asyncH(async (req, res) => res.json(engine.funcs().ms(req.body))));
router.post('/cog', asyncH(async (req, res) => res.json(engine.funcs().cog_rehab(req.body))));
router.post('/sw', asyncH(async (req, res) => res.json(engine.funcs().sw(req.body))));
module.exports = router;
