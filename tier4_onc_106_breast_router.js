'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_onc_106_breast_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/subtype', asyncH((req, res) => res.json(engine.breastCancerSubtype(req.body))));
router.post('/genetic', asyncH((req, res) => res.json(engine.geneticRisk(req.body))));
module.exports = router;