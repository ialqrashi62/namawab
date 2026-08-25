'use strict';
const express = require('express');
const engine = require('./tier4_endo_ext_104_pheo_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/workup', asyncH((req, res) => res.json(engine.workup(req.body || {}))));
r.post('/preop', asyncH((req, res) => res.json(engine.preop(req.body || {}))));
module.exports = r;