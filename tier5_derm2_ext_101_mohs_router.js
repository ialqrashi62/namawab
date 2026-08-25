// filepath: tier5_derm2_ext_101_mohs_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_derm2_ext_101_mohs_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/cand', asyncH(async (req, res) => res.json(engine.funcs().mohs_candidate(req.body))));
router.post('/stages', asyncH(async (req, res) => res.json(engine.funcs().stage_count(req.body))));
router.post('/breslow', asyncH(async (req, res) => res.json(engine.funcs().breslow(req.body))));
router.post('/bcc-st', asyncH(async (req, res) => res.json(engine.funcs().bcc_subtype(req.body))));
router.post('/defect', asyncH(async (req, res) => res.json(engine.funcs().defect_closure(req.body))));

module.exports = router;
