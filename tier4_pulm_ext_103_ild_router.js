'use strict';
const express = require('express');
const engine = require('./tier4_pulm_ext_103_ild_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/pattern', asyncH((req, res) => res.json(engine.pattern(req.body || {}))));
r.post('/workup', asyncH((req, res) => res.json(engine.workup(req.body || {}))));
module.exports = r;