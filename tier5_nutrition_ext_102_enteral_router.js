'use strict';
const express = require('express');
const engine = require('./tier5_nutrition_ext_102_enteral_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/rate', asyncH((req, res) => res.json(engine.rate_calc(req.body || {}))));
r.post('/formula', asyncH((req, res) => res.json(engine.formula_choice(req.body || {}))));
module.exports = r;