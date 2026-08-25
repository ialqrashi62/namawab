'use strict';
const express = require('express');
const engine = require('./tier4_infect_ext_103_hepatitis_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/hepb', asyncH((req, res) => res.json(engine.hepb(req.body || {}))));
r.post('/hepc', asyncH((req, res) => res.json(engine.hepc(req.body || {}))));
module.exports = r;