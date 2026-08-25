'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_psych_105_trauma_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/ptsd', asyncH((req, res) => res.json(engine.ptsdSeverity(req.body))));
router.post('/complex', asyncH((req, res) => res.json(engine.complexTrauma(req.body))));
module.exports = router;