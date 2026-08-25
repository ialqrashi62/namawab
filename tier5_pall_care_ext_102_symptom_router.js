// filepath: tier5_pall_care_ext_102_symptom_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pall_care_ext_102_symptom_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/dysp', asyncH(async (req, res) => res.json(engine.funcs().dyspnea(req.body))));
router.post('/delir', asyncH(async (req, res) => res.json(engine.funcs().delirium(req.body))));
router.post('/depr', asyncH(async (req, res) => res.json(engine.funcs().depression(req.body))));
router.post('/anx', asyncH(async (req, res) => res.json(engine.funcs().anxiety(req.body))));
router.post('/fatig', asyncH(async (req, res) => res.json(engine.funcs().fatigue(req.body))));
router.post('/gi', asyncH(async (req, res) => res.json(engine.funcs().gi_symptoms(req.body))));
module.exports = router;
