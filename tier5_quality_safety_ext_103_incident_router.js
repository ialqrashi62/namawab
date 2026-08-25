// filepath: tier5_quality_safety_ext_103_incident_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_quality_safety_ext_103_incident_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/rep', asyncH(async (req, res) => res.json(engine.funcs().report(req.body))));
router.post('/sev', asyncH(async (req, res) => res.json(engine.funcs().severity(req.body))));
router.post('/bl', asyncH(async (req, res) => res.json(engine.funcs().blameless(req.body))));
router.post('/cat', asyncH(async (req, res) => res.json(engine.funcs().categories(req.body))));
router.post('/disc', asyncH(async (req, res) => res.json(engine.funcs().disclosure(req.body))));
router.post('/an', asyncH(async (req, res) => res.json(engine.funcs().analysis(req.body))));
module.exports = router;
