// filepath: tier5_sdoh_ext_102_health_literacy_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_sdoh_ext_102_health_literacy_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/realm', asyncH(async (req, res) => res.json(engine.funcs().realm_score(req.body))));
router.post('/teachback', asyncH(async (req, res) => res.json(engine.funcs().teach_back(req.body))));
router.post('/language', asyncH(async (req, res) => res.json(engine.funcs().language_access(req.body))));
router.post('/education', asyncH(async (req, res) => res.json(engine.funcs().education(req.body))));
router.post('/ehealth', asyncH(async (req, res) => res.json(engine.funcs().ehealth_literacy(req.body))));

module.exports = router;
