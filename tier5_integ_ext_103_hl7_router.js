'use strict';
const express = require('express');
const engine = require('./tier5_integ_ext_103_hl7_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/parse', asyncH((req, res) => res.json(engine.parse_message(req.body || {}))));
r.post('/compose', asyncH((req, res) => res.json(engine.compose_message(req.body || {}))));
r.post('/validate', asyncH((req, res) => res.json(engine.validate_message(req.body || {}))));
module.exports = r;