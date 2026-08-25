'use strict';
const express = require('express');
const engine = require('./tier4_neph_ext_106_gn_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/classify', asyncH((req, res) => res.json(engine.classify(req.body || {}))));
r.post('/biopsy', asyncH((req, res) => res.json(engine.biopsy(req.body || {}))));
module.exports = r;