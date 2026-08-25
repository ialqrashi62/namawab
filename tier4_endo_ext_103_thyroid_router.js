'use strict';
const express = require('express');
const engine = require('./tier4_endo_ext_103_thyroid_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/workup', asyncH((req, res) => res.json(engine.workup(req.body || {}))));
r.post('/cancer', asyncH((req, res) => res.json(engine.cancer(req.body || {}))));
module.exports = r;