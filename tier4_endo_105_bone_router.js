'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_endo_105_bone_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/osteoporosis', asyncH((req, res) => res.json(engine.osteoporosisFractureRisk(req.body))));
router.post('/hypercalcemia', asyncH((req, res) => res.json(engine.hypercalcemia(req.body))));
module.exports = router;