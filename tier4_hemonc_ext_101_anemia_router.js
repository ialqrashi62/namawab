'use strict';
const express = require('express');
const engine = require('./tier4_hemonc_ext_101_anemia_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/classify', asyncH((req, res) => res.json(engine.classify(req.body || {}))));
r.post('/workup', asyncH((req, res) => res.json(engine.workup(req.body || {}))));
module.exports = r;