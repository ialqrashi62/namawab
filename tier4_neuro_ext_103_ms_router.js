'use strict';
const express = require('express');
const engine = require('./tier4_neuro_ext_103_ms_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/criteria', asyncH((req, res) => res.json(engine.criteria(req.body || {}))));
r.post('/dmt', asyncH((req, res) => res.json(engine.dmt(req.body || {}))));
module.exports = r;