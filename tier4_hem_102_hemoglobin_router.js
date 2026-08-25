'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_hem_102_hemoglobin_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/sc', asyncH((req, res) => res.json(engine.sickleCellPain(req.body))));
router.post('/thal', asyncH((req, res) => res.json(engine.thalassemia(req.body))));
module.exports = router;