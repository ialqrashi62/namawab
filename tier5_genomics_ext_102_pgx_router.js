'use strict';
const express = require('express');
const engine = require('./tier5_genomics_ext_102_pgx_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/clopidogrel', asyncH((req, res) => res.json(engine.clopidogrel(req.body || {}))));
r.post('/warfarin', asyncH((req, res) => res.json(engine.warfarin(req.body || {}))));
r.post('/codeine', asyncH((req, res) => res.json(engine.codeine(req.body || {}))));
module.exports = r;