'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pulm_106_cf_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/modulator', asyncH((req, res) => res.json(engine.cfModulator(req.body))));
router.post('/exac', asyncH((req, res) => res.json(engine.cfExacerbation(req.body))));
module.exports = router;