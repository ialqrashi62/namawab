'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_dent_101_carries_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/risk', asyncH((req, res) => res.json(engine.cariesRisk(req.body))));
router.post('/pulp', asyncH((req, res) => res.json(engine.pulpStatus(req.body))));
module.exports = router;