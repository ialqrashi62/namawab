'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_nutr_103_pediatric_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/formula', asyncH((req, res) => res.json(engine.infantFormula(req.body))));
router.post('/ftt', asyncH((req, res) => res.json(engine.failureToThrive(req.body))));
module.exports = router;