'use strict';
const express = require('express');
const engine = require('./tier5_integ_ext_106_caretrans_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/ipass', asyncH((req, res) => res.json(engine.ipass_handoff(req.body || {}))));
r.post('/transfer', asyncH((req, res) => res.json(engine.transfer_summary(req.body || {}))));
module.exports = r;