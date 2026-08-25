'use strict';
const express = require('express');
const engine = require('./tier4_obgyn_ext_101_preeclampsia_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/severity', asyncH((req, res) => res.json(engine.severity(req.body || {}))));
r.post('/mg', asyncH((req, res) => res.json(engine.mg(req.body || {}))));
module.exports = r;