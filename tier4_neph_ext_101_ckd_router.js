'use strict';
const express = require('express');
const engine = require('./tier4_neph_ext_101_ckd_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/stage', asyncH((req, res) => res.json(engine.stage(req.body || {}))));
r.post('/kfre', asyncH((req, res) => res.json(engine.kfre(req.body || {}))));
module.exports = r;