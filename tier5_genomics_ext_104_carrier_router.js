'use strict';
const express = require('express');
const engine = require('./tier5_genomics_ext_104_carrier_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/recommend', asyncH((req, res) => res.json(engine.recommend(req.body || {}))));
r.post('/result_counsel', asyncH((req, res) => res.json(engine.result_counsel(req.body || {}))));
module.exports = r;