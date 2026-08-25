'use strict';
const express = require('express');
const engine = require('./tier4_neuro_ext_102_stroke_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/tpa_eligible', asyncH((req, res) => res.json(engine.tpa_eligible(req.body || {}))));
r.post('/secondary_prevention', asyncH((req, res) => res.json(engine.secondary_prevention(req.body || {}))));
module.exports = r;