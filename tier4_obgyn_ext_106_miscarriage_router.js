'use strict';
const express = require('express');
const engine = require('./tier4_obgyn_ext_106_miscarriage_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/classify', asyncH((req, res) => res.json(engine.classify(req.body || {}))));
r.post('/rpl_workup', asyncH((req, res) => res.json(engine.rpl_workup(req.body || {}))));
module.exports = r;