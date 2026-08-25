'use strict';
const express = require('express');
const engine = require('./tier4_ortho_ext_104_hip_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/oa', asyncH((req, res) => res.json(engine.oa(req.body || {}))));
r.post('/fracture_risk', asyncH((req, res) => res.json(engine.fracture_risk(req.body || {}))));
module.exports = r;