'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_genetic_102_prenatal_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/cfdna', asyncH((req, res) => res.json(engine.cellFreeDnaScreening(req.body))));
router.post('/fts', asyncH((req, res) => res.json(engine.firstTrimesterScreen(req.body))));
module.exports = router;