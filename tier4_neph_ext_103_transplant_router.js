'use strict';
const express = require('express');
const engine = require('./tier4_neph_ext_103_transplant_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/recipient', asyncH((req, res) => res.json(engine.recipient(req.body || {}))));
r.post('/donor', asyncH((req, res) => res.json(engine.donor(req.body || {}))));
module.exports = r;