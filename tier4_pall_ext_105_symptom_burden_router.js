'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pall_ext_105_symptom_burden_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/esas', asyncH((req, res) => res.json(engine.esasScore(req.body))));
module.exports = router;