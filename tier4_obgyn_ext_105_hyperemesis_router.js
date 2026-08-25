'use strict';
const express = require('express');
const engine = require('./tier4_obgyn_ext_105_hyperemesis_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/severity', asyncH((req, res) => res.json(engine.severity(req.body || {}))));
r.post('/treat', asyncH((req, res) => res.json(engine.treat(req.body || {}))));
module.exports = r;