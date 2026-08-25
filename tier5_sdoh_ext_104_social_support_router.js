// filepath: tier5_sdoh_ext_104_social_support_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_sdoh_ext_104_social_support_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/moss', asyncH(async (req, res) => res.json(engine.funcs().mos_ss(req.body))));
router.post('/caregiver', asyncH(async (req, res) => res.json(engine.funcs().caregiver_burden(req.body))));
router.post('/oslo3', asyncH(async (req, res) => res.json(engine.funcs().oslo_3(req.body))));
router.post('/capacity', asyncH(async (req, res) => res.json(engine.funcs().caregiver_capacity(req.body))));
router.post('/crisis', asyncH(async (req, res) => res.json(engine.funcs().crisis_social(req.body))));

module.exports = router;
