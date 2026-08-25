'use strict';
const express = require('express');
const engine = require('./tier4_card_ext_104_cad_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/risk', asyncH((req, res) => res.json(engine.risk(req.body || {}))));
r.post('/syntax', asyncH((req, res) => res.json(engine.syntax(req.body || {}))));
module.exports = r;