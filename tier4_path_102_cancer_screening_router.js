'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_path_102_cancer_screening_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/cervical', asyncH((req, res) => res.json(engine.cervicalScreening(req.body))));
router.post('/breast', asyncH((req, res) => res.json(engine.breastCancerScreening(req.body))));
module.exports = router;