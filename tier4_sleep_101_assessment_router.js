'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_sleep_101_assessment_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/psqi', asyncH((req, res) => res.json(engine.psqi(req.body))));
router.post('/ess', asyncH((req, res) => res.json(engine.epworth(req.body))));
module.exports = router;