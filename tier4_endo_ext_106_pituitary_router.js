'use strict';
const express = require('express');
const engine = require('./tier4_endo_ext_106_pituitary_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/acromegaly', asyncH((req, res) => res.json(engine.acromegaly(req.body || {}))));
r.post('/prolactinoma', asyncH((req, res) => res.json(engine.prolactinoma(req.body || {}))));
module.exports = r;