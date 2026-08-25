'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_onc_108_palliative_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/pain', asyncH((req, res) => res.json(engine.cancerPain(req.body))));
router.post('/cachexia', asyncH((req, res) => res.json(engine.cachexia(req.body))));
router.post('/hospice', asyncH((req, res) => res.json(engine.hospiceEligibility(req.body))));
module.exports = router;