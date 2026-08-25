'use strict';
const express = require('express');
const engine = require('./tier5_nutrition_ext_101_malnutrition_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/screen', asyncH((req, res) => res.json(engine.mst_screen(req.body || {}))));
r.post('/assessment', asyncH((req, res) => res.json(engine.sga_assessment(req.body || {}))));
module.exports = r;