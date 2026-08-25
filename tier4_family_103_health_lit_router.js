'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_family_103_health_lit_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/screen', asyncH((req, res) => res.json(engine.healthLitQuickScreen(req.body))));
router.post('/comm', asyncH((req, res) => res.json(engine.patientCommunication(req.body))));
module.exports = router;