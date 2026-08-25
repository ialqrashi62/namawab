'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_gyn_ext_106_contraception_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/choice', asyncH((req, res) => res.json(engine.contraceptionChoice(req.body))));
router.post('/emergency', asyncH((req, res) => res.json(engine.emergencyContraception(req.body))));
module.exports = router;