'use strict';
const express = require('express');
const engine = require('./tier4_gi_ext_105_pancreatitis_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/severity', asyncH((req, res) => res.json(engine.severity(req.body || {}))));
r.post('/manage', asyncH((req, res) => res.json(engine.manage(req.body || {}))));
module.exports = r;