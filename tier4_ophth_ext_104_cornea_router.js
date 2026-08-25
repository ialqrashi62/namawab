'use strict';
const express = require('express');
const engine = require('./tier4_ophth_ext_104_cornea_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/ulcer', asyncH((req, res) => res.json(engine.ulcer(req.body || {}))));
r.post('/dry_eye', asyncH((req, res) => res.json(engine.dry_eye(req.body || {}))));
module.exports = r;