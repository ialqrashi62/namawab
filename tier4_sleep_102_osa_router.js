'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_sleep_102_osa_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/stopbang', asyncH((req, res) => res.json(engine.stopBang(req.body))));
router.post('/ahi', asyncH((req, res) => res.json(engine.osaSeverity(req.body))));
module.exports = router;