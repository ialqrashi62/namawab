'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_sleep_105_circadian_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/chrono', asyncH((req, res) => res.json(engine.morningEveningness(req.body))));
router.post('/shift', asyncH((req, res) => res.json(engine.shiftWork(req.body))));
module.exports = router;