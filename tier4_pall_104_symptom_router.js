'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pall_104_symptom_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/dyspnea', asyncH((req, res) => res.json(engine.dyspnea(req.body))));
router.post('/nausea', asyncH((req, res) => res.json(engine.palliativeNausea(req.body))));
module.exports = router;