'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_ophth_102_retina_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/dr', asyncH((req, res) => res.json(engine.diabeticRetinopathy(req.body))));
router.post('/amd', asyncH((req, res) => res.json(engine.amdAssessment(req.body))));
module.exports = router;