'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_nutr_101_assessment_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/diet', asyncH((req, res) => res.json(engine.dietQuality(req.body))));
router.post('/mediter', asyncH((req, res) => res.json(engine.mediterraneanScore(req.body))));
module.exports = router;