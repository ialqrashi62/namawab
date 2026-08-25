'use strict';
const express = require('express');
const engine = require('./tier4_hemonc_ext_105_transfusion_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/compatibility', asyncH((req, res) => res.json(engine.compatibility(req.body || {}))));
r.post('/component', asyncH((req, res) => res.json(engine.component(req.body || {}))));
module.exports = r;