'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_surg_101_preop_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/asa', asyncH((req, res) => res.json(engine.asaClassification(req.body))));
router.post('/npo', asyncH((req, res) => res.json(engine.npoGuideline(req.body))));
module.exports = router;