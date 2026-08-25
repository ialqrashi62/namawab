'use strict';
const express = require('express');
const engine = require('./tier4_endo_ext_102_lipid_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/risk', asyncH((req, res) => res.json(engine.risk(req.body || {}))));
r.post('/statin_intensity', asyncH((req, res) => res.json(engine.statin_intensity(req.body || {}))));
module.exports = r;