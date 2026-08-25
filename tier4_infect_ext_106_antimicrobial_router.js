'use strict';
const express = require('express');
const engine = require('./tier4_infect_ext_106_antimicrobial_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/stewardship', asyncH((req, res) => res.json(engine.stewardship(req.body || {}))));
r.post('/resistance', asyncH((req, res) => res.json(engine.resistance(req.body || {}))));
module.exports = r;