'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_dent_102_periodontal_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/stage', asyncH((req, res) => res.json(engine.periodontalStage(req.body))));
router.post('/gingivitis', asyncH((req, res) => res.json(engine.gingivitis(req.body))));
module.exports = router;