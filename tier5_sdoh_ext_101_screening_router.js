// filepath: tier5_sdoh_ext_101_screening_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_sdoh_ext_101_screening_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/housing', asyncH(async (req, res) => res.json(engine.funcs().housing_insecurity(req.body))));
router.post('/food', asyncH(async (req, res) => res.json(engine.funcs().food_insecurity(req.body))));
router.post('/transport', asyncH(async (req, res) => res.json(engine.funcs().transport(req.body))));
router.post('/safety', asyncH(async (req, res) => res.json(engine.funcs().safety_concerns(req.body))));
router.post('/employ', asyncH(async (req, res) => res.json(engine.funcs().employment_econ(req.body))));

module.exports = router;
