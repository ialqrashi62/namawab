'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pulm_105_sleep_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/osa', asyncH((req, res) => res.json(engine.osaSeverity(req.body))));
router.post('/insomnia', asyncH((req, res) => res.json(engine.insomniaCBT(req.body))));
module.exports = router;