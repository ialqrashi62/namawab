'use strict';
const express = require('express');
const engine = require('./tier4_neph_ext_102_dialysis_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/hd_adequacy', asyncH((req, res) => res.json(engine.hd_adequacy(req.body || {}))));
r.post('/modality', asyncH((req, res) => res.json(engine.modality(req.body || {}))));
module.exports = r;