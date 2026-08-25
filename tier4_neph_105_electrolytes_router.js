'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_neph_105_electrolytes_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/hyperkalemia', asyncH((req, res) => res.json(engine.hyperkalemia(req.body))));
router.post('/hyponatremia', asyncH((req, res) => res.json(engine.hyponatremia(req.body))));
router.post('/acidosis', asyncH((req, res) => res.json(engine.metabolicAcidosis(req.body))));
module.exports = router;