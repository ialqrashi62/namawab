'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_psych_101_depression_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/phq9', asyncH((req, res) => res.json(engine.phq9Severity(req.body))));
router.post('/trd', asyncH((req, res) => res.json(engine.treatmentResistantDepression(req.body))));
module.exports = router;