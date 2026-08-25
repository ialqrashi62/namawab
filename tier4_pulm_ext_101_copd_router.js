'use strict';
const express = require('express');
const engine = require('./tier4_pulm_ext_101_copd_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/gold', asyncH((req, res) => res.json(engine.gold(req.body || {}))));
r.post('/exacerbation', asyncH((req, res) => res.json(engine.exacerbation(req.body || {}))));
module.exports = r;