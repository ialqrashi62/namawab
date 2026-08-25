'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_genetic_101_brca_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/risk', asyncH((req, res) => res.json(engine.brcaRiskAssessment(req.body))));
router.post('/note', asyncH((req, res) => res.json(engine.geneticCounselingNote(req.body))));
module.exports = router;