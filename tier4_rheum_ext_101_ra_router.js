'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rheum_ext_101_ra_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/acr', asyncH((req, res) => res.json(engine.acrEularClassification(req.body))));
router.post('/das28', asyncH((req, res) => res.json(engine.das28Score(req.body))));
module.exports = router;