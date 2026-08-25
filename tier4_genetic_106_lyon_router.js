'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_genetic_106_lyon_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/lyon', asyncH((req, res) => res.json(engine.lyonInactivation(req.body))));
router.post('/xrec', asyncH((req, res) => res.json(engine.xlinkedRecurrenceRisk(req.body))));
module.exports = router;