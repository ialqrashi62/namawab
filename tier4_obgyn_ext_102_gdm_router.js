'use strict';
const express = require('express');
const engine = require('./tier4_obgyn_ext_102_gdm_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/screen', asyncH((req, res) => res.json(engine.screen(req.body || {}))));
r.post('/treat', asyncH((req, res) => res.json(engine.treat(req.body || {}))));
module.exports = r;