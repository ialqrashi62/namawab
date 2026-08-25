'use strict';
const express = require('express');
const engine = require('./tier4_neph_ext_105_aki_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/classify', asyncH((req, res) => res.json(engine.classify(req.body || {}))));
r.post('/etiology', asyncH((req, res) => res.json(engine.etiology(req.body || {}))));
module.exports = r;