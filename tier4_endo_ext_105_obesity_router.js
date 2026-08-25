'use strict';
const express = require('express');
const engine = require('./tier4_endo_ext_105_obesity_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/classify', asyncH((req, res) => res.json(engine.classify(req.body || {}))));
r.post('/treatment', asyncH((req, res) => res.json(engine.treatment(req.body || {}))));
module.exports = r;