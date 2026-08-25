'use strict';
const express = require('express');
const engine = require('./tier5_genomics_ext_106_trio_wes_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/indication', asyncH((req, res) => res.json(engine.indication(req.body || {}))));
r.post('/variant', asyncH((req, res) => res.json(engine.variant_interpret(req.body || {}))));
module.exports = r;