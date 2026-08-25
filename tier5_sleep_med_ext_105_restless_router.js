// filepath: tier5_sleep_med_ext_105_restless_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_sleep_med_ext_105_restless_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/sev', asyncH(async (req, res) => res.json(engine.funcs().rls_severity(req.body))));
router.post('/treat', asyncH(async (req, res) => res.json(engine.funcs().rls_treatment(req.body))));
router.post('/rbd', asyncH(async (req, res) => res.json(engine.funcs().rbd(req.body))));
router.post('/plm', asyncH(async (req, res) => res.json(engine.funcs().plm(req.body))));
router.post('/brux', asyncH(async (req, res) => res.json(engine.funcs().bruxism(req.body))));
router.post('/prev', asyncH(async (req, res) => res.json(engine.funcs().rls_prevention(req.body))));
module.exports = router;
