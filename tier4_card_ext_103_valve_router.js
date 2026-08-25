'use strict';
const express = require('express');
const engine = require('./tier4_card_ext_103_valve_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/as', asyncH((req, res) => res.json(engine.as_severity(req.body || {}))));
r.post('/mr', asyncH((req, res) => res.json(engine.mr_severity(req.body || {}))));
module.exports = r;