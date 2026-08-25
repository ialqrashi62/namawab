'use strict';
const express = require('express');
const engine = require('./tier4_gi_ext_104_cirrhosis_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/meld', asyncH((req, res) => res.json(engine.meld(req.body || {}))));
r.post('/decompensation', asyncH((req, res) => res.json(engine.decompensation(req.body || {}))));
module.exports = r;