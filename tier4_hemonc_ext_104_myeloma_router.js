'use strict';
const express = require('express');
const engine = require('./tier4_hemonc_ext_104_myeloma_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/mgus', asyncH((req, res) => res.json(engine.mgus(req.body || {}))));
r.post('/myeloma', asyncH((req, res) => res.json(engine.myeloma(req.body || {}))));
module.exports = r;