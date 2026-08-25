'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rheum_101_ra_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/das28', asyncH((req, res) => res.json(engine.das28Score(req.body))));
router.post('/t2t', asyncH((req, res) => res.json(engine.treatToTarget(req.body))));
module.exports = router;