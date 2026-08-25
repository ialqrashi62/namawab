// filepath: tier5_ops_ext_104_accreditation_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ops_ext_104_accreditation_engine.js');

const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/gap', asyncH(async (req, res) => res.json(engine.funcs().gap_analyze(req.body))));
router.post('/standard', asyncH(async (req, res) => res.json(engine.funcs().standard_score(req.body))));
router.post('/chapter', asyncH(async (req, res) => res.json(engine.funcs().chapter_summary(req.body))));
router.post('/readiness', asyncH(async (req, res) => res.json(engine.funcs().survey_readiness(req.body))));
router.post('/action', asyncH(async (req, res) => res.json(engine.funcs().action_plan(req.body))));

module.exports = router;
