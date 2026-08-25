// filepath: tier5_addiction_med_ext_106_recovery_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_addiction_med_ext_106_recovery_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/plan', asyncH(async (req, res) => res.json(engine.funcs().recovery_plan(req.body))));
router.post('/peer', asyncH(async (req, res) => res.json(engine.funcs().peer(req.body))));
router.post('/hous', asyncH(async (req, res) => res.json(engine.funcs().housing_stab(req.body))));
router.post('/emp', asyncH(async (req, res) => res.json(engine.funcs().employment(req.body))));
router.post('/fam', asyncH(async (req, res) => res.json(engine.funcs().family_sup(req.body))));
router.post('/adv', asyncH(async (req, res) => res.json(engine.funcs().advocacy(req.body))));
module.exports = router;
