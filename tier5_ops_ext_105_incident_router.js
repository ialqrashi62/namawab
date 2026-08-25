// filepath: tier5_ops_ext_105_incident_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ops_ext_105_incident_engine.js');

const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/classify', asyncH(async (req, res) => res.json(engine.funcs().classify_event(req.body))));
router.post('/trigger', asyncH(async (req, res) => res.json(engine.funcs().trigger_review(req.body))));
router.post('/trend', asyncH(async (req, res) => res.json(engine.funcs().trend_incidences(req.body))));
router.post('/disclosure', asyncH(async (req, res) => res.json(engine.funcs().disclosure_support(req.body))));
router.post('/culture', asyncH(async (req, res) => res.json(engine.funcs().near_miss_culture(req.body))));

module.exports = router;
