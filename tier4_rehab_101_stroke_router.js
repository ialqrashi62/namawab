'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_rehab_101_stroke_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/berg', asyncH((req, res) => res.json(engine.bergBalance(req.body))));
router.post('/recovery', asyncH((req, res) => res.json(engine.postStrokeRecovery(req.body))));
module.exports = router;