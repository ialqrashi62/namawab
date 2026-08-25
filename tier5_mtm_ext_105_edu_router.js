// filepath: tier5_mtm_ext_105_edu_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_mtm_ext_105_edu_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/teachback', asyncH(async (req, res) => res.json(engine.funcs().teach_back(req.body))));
router.post('/mdi', asyncH(async (req, res) => res.json(engine.funcs().mdi_spacer(req.body))));
router.post('/pen', asyncH(async (req, res) => res.json(engine.funcs().insulin_pen(req.body))));
router.post('/meter', asyncH(async (req, res) => res.json(engine.funcs().glucometer(req.body))));
router.post('/inh', asyncH(async (req, res) => res.json(engine.funcs().inh_counseling(req.body))));
router.post('/warf', asyncH(async (req, res) => res.json(engine.funcs().warfarin_education(req.body))));

module.exports = router;
