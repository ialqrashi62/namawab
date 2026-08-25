'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_chronic_101_assessment_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/severity', asyncH((req, res) => res.json(engine.chronicDiseaseSeverity(req.body))));
router.post('/adl', asyncH((req, res) => res.json(engine.adlFunction(req.body))));
module.exports = router;