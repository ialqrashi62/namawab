// filepath: tier5_ed_ext_101_triage_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ed_ext_101_triage_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/esi', asyncH(async (req, res) => res.json(engine.funcs().esi(req.body))));
router.post('/vital', asyncH(async (req, res) => res.json(engine.funcs().vital_sign_assessment(req.body))));
router.post('/complaint', asyncH(async (req, res) => res.json(engine.funcs().chief_complaint(req.body))));
router.post('/acuity', asyncH(async (req, res) => res.json(engine.funcs().acuity_assessment(req.body))));
router.post('/pain', asyncH(async (req, res) => res.json(engine.funcs().pain_score(req.body))));
router.post('/dispo', asyncH(async (req, res) => res.json(engine.funcs().triage_disposition(req.body))));

module.exports = router;
