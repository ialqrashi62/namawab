'use strict';
const express = require('express');
const engine = require('./tier4_endo_ext_101_dm_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/insulin_titration', asyncH((req, res) => res.json(engine.insulin_titration(req.body || {}))));
r.post('/dka', asyncH((req, res) => res.json(engine.dka(req.body || {}))));
module.exports = r;