// filepath: tier5_pall_care_ext2_105_family_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pall_care_ext2_105_family_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/fm', asyncH(async (req, res) => res.json(engine.funcs().family_meeting(req.body))));
router.post('/cb', asyncH(async (req, res) => res.json(engine.funcs().caregiver_burden(req.body))));
router.post('/ant', asyncH(async (req, res) => res.json(engine.funcs().anticipatory(req.body))));
router.post('/conf', asyncH(async (req, res) => res.json(engine.funcs().conflict(req.body))));
router.post('/sr', asyncH(async (req, res) => res.json(engine.funcs().support_resources(req.body))));
router.post('/chi', asyncH(async (req, res) => res.json(engine.funcs().child_support(req.body))));
module.exports = router;
