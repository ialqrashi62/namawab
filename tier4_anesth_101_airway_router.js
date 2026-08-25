'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_anesth_101_airway_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/assessment', asyncH((req, res) => res.json(engine.airwayAssessment(req.body))));
router.post('/aspir', asyncH((req, res) => res.json(engine.aspirationRisk(req.body))));
module.exports = router;