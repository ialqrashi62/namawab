'use strict';
const express = require('express');
const engine = require('./tier4_card_ext_102_arrhythmia_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/af', asyncH((req, res) => res.json(engine.af(req.body || {}))));
r.post('/vt', asyncH((req, res) => res.json(engine.vt(req.body || {}))));
module.exports = r;