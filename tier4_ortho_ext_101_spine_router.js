'use strict';
const express = require('express');
const engine = require('./tier4_ortho_ext_101_spine_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/red_flags', asyncH((req, res) => res.json(engine.red_flags(req.body || {}))));
r.post('/disc_herniation', asyncH((req, res) => res.json(engine.disc_herniation(req.body || {}))));
module.exports = r;