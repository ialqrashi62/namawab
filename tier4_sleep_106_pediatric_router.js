'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_sleep_106_pediatric_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/needs', asyncH((req, res) => res.json(engine.pediatricSleepNeeds(req.body))));
router.post('/osa', asyncH((req, res) => res.json(engine.pediatricObstructive(req.body))));
module.exports = router;