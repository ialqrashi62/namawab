'use strict';
const express = require('express');
const engine = require('./tier5_nutrition_ext_104_peds_nutrition_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/intake', asyncH((req, res) => res.json(engine.intake_target(req.body || {}))));
r.post('/growth', asyncH((req, res) => res.json(engine.growth_z_score(req.body || {}))));
module.exports = r;