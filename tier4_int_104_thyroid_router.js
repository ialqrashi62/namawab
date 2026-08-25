'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_int_104_thyroid_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/hypothyroid', asyncH((req, res) => res.json(engine.hypothyroidEvaluation(req.body))));
router.post('/hyperthyroid', asyncH((req, res) => res.json(engine.hyperthyroidEvaluation(req.body))));
module.exports = router;