'use strict';
const express = require('express');
const engine = require('./tier5_integ_ext_105_careplan_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/generate', asyncH((req, res) => res.json(engine.generate(req.body || {}))));
r.post('/revise', asyncH((req, res) => res.json(engine.revise(req.body || {}))));
module.exports = r;