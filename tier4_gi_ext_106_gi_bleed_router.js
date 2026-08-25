'use strict';
const express = require('express');
const engine = require('./tier4_gi_ext_106_gi_bleed_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/localize', asyncH((req, res) => res.json(engine.localize(req.body || {}))));
r.post('/risk', asyncH((req, res) => res.json(engine.risk(req.body || {}))));
module.exports = r;