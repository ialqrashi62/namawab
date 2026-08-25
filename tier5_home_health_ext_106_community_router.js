// filepath: tier5_home_health_ext_106_community_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_home_health_ext_106_community_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/vuln', asyncH(async (req, res) => res.json(engine.funcs().vulnerable_home(req.body))));
router.post('/school', asyncH(async (req, res) => res.json(engine.funcs().school_visit_nurse(req.body))));
router.post('/mch', asyncH(async (req, res) => res.json(engine.funcs().mch_visit(req.body))));
router.post('/injury', asyncH(async (req, res) => res.json(engine.funcs().injury_prevention(req.body))));
router.post('/commdx', asyncH(async (req, res) => res.json(engine.funcs().communicable_disease(req.body))));

module.exports = router;
