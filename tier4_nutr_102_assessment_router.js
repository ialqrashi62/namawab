'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_nutr_102_assessment_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/mst', asyncH((req, res) => res.json(engine.malnutritionUniversal(req.body))));
router.post('/calorie', asyncH((req, res) => res.json(engine.calorieNeeds(req.body))));
module.exports = router;