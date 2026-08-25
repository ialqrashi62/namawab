'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_urg_105_toxicology_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/acet', asyncH((req, res) => res.json(engine.acetaminophen(req.body))));
router.post('/opioid', asyncH((req, res) => res.json(engine.opioid(req.body))));
module.exports = router;