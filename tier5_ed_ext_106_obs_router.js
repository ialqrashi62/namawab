// filepath: tier5_ed_ext_106_obs_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ed_ext_106_obs_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/status', asyncH(async (req, res) => res.json(engine.funcs().observation_status(req.body))));
router.post('/cdu', asyncH(async (req, res) => res.json(engine.funcs().clinical_decision_unit(req.body))));
router.post('/dchready', asyncH(async (req, res) => res.json(engine.funcs().discharge_readiness(req.body))));
router.post('/dchinstr', asyncH(async (req, res) => res.json(engine.funcs().discharge_instructions(req.body))));
router.post('/revisit', asyncH(async (req, res) => res.json(engine.funcs().revisit_risk(req.body))));
router.post('/contin', asyncH(async (req, res) => res.json(engine.funcs().observation_continuity(req.body))));

module.exports = router;
