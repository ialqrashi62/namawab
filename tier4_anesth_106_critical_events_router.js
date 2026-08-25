'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_anesth_106_critical_events_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/mh', asyncH((req, res) => res.json(engine.malignantHyperthermia(req.body))));
router.post('/hypotension', asyncH((req, res) => res.json(engine.hypotensionManagement(req.body))));
module.exports = router;