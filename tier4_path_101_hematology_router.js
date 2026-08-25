'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_path_101_hematology_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/cbc', asyncH((req, res) => res.json(engine.cbcInterpretation(req.body))));
router.post('/smear', asyncH((req, res) => res.json(engine.peripheralSmear(req.body))));
module.exports = router;