'use strict';
const express = require('express');
const engine = require('./tier4_ortho_ext_102_knee_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/oa', asyncH((req, res) => res.json(engine.oa(req.body || {}))));
r.post('/meniscus', asyncH((req, res) => res.json(engine.meniscus(req.body || {}))));
r.post('/acl', asyncH((req, res) => res.json(engine.acl(req.body || {}))));
module.exports = r;