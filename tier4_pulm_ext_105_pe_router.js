'use strict';
const express = require('express');
const engine = require('./tier4_pulm_ext_105_pe_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/risk', asyncH((req, res) => res.json(engine.risk(req.body || {}))));
r.post('/treatment', asyncH((req, res) => res.json(engine.treatment(req.body || {}))));
module.exports = r;