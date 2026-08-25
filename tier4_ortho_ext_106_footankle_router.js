'use strict';
const express = require('express');
const engine = require('./tier4_ortho_ext_106_footankle_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/achilles', asyncH((req, res) => res.json(engine.achilles(req.body || {}))));
r.post('/plantar', asyncH((req, res) => res.json(engine.plantar(req.body || {}))));
r.post('/ankle_sprain', asyncH((req, res) => res.json(engine.ankle_sprain(req.body || {}))));
module.exports = r;