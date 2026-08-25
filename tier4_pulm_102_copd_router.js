'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pulm_102_copd_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/gold', asyncH((req, res) => res.json(engine.goldClassification(req.body))));
router.post('/exac', asyncH((req, res) => res.json(engine.copdExacerbation(req.body))));
module.exports = router;