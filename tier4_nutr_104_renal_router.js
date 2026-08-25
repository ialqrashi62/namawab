'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_nutr_104_renal_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/renal', asyncH((req, res) => res.json(engine.renalNutrition(req.body))));
router.post('/diabetic', asyncH((req, res) => res.json(engine.diabeticNutrition(req.body))));
module.exports = router;