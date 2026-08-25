'use strict';
const express = require('express');
const engine = require('./tier5_genomics_ext_105_nbs_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/interpret', asyncH((req, res) => res.json(engine.interpret(req.body || {}))));
r.post('/timing', asyncH((req, res) => res.json(engine.timing(req.body || {}))));
module.exports = r;