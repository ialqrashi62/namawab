'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_chronic_106_palliative_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/goals', asyncH((req, res) => res.json(engine.goalsOfCare(req.body))));
router.post('/symptoms', asyncH((req, res) => res.json(engine.symptomBurden(req.body))));
module.exports = router;