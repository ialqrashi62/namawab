'use strict';
const express = require('express');
const engine = require('./tier5_genomics_ext_103_prenatal_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/screen', asyncH((req, res) => res.json(engine.screen(req.body || {}))));
r.post('/diagnostic', asyncH((req, res) => res.json(engine.diagnostic(req.body || {}))));
module.exports = r;