'use strict';
const express = require('express');
const engine = require('./tier4_gi_ext_103_ibs_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/diagnose', asyncH((req, res) => res.json(engine.diagnose(req.body || {}))));
r.post('/treat', asyncH((req, res) => res.json(engine.treat(req.body || {}))));
module.exports = r;