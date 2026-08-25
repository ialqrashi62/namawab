'use strict';
const express = require('express');
const engine = require('./tier4_derm_ext_106_nails_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/onycho', asyncH((req, res) => res.json(engine.onycho(req.body || {}))));
r.post('/paronychia', asyncH((req, res) => res.json(engine.paronychia(req.body || {}))));
module.exports = r;