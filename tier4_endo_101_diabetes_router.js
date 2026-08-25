'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_endo_101_diabetes_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/classify', asyncH((req, res) => res.json(engine.diabetesClassification(req.body))));
router.post('/insulin', asyncH((req, res) => res.json(engine.insulinInitiation(req.body))));
router.post('/dka', asyncH((req, res) => res.json(engine.diabeticKetoacidosis(req.body))));
module.exports = router;