'use strict';
const express = require('express');
const engine = require('./tier4_neuro_ext_105_nm_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/mg', asyncH((req, res) => res.json(engine.mg(req.body || {}))));
r.post('/gbs', asyncH((req, res) => res.json(engine.gbs(req.body || {}))));
r.post('/cidp', asyncH((req, res) => res.json(engine.cidp(req.body || {}))));
module.exports = r;