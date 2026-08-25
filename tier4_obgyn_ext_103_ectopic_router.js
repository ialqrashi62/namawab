'use strict';
const express = require('express');
const engine = require('./tier4_obgyn_ext_103_ectopic_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/diagnose', asyncH((req, res) => res.json(engine.diagnose(req.body || {}))));
r.post('/management', asyncH((req, res) => res.json(engine.management(req.body || {}))));
module.exports = r;