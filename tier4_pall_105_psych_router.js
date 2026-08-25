'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pall_105_psych_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/grief', asyncH((req, res) => res.json(engine.griefAssessment(req.body))));
module.exports = router;