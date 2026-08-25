'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_int_102_hypertension_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/classify', asyncH((req, res) => res.json(engine.htnClassification(req.body))));
router.post('/treat', asyncH((req, res) => res.json(engine.htnTreatment(req.body))));
module.exports = router;