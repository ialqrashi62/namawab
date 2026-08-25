'use strict';
const express = require('express');
const engine = require('./tier4_infect_ext_101_sepsis_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/qsofa', asyncH((req, res) => res.json(engine.qsofa(req.body || {}))));
r.post('/bundle', asyncH((req, res) => res.json(engine.bundle(req.body || {}))));
module.exports = r;