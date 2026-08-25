'use strict';
const express = require('express');
const engine = require('./tier4_hemonc_ext_106_anticoag_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/warfarin', asyncH((req, res) => res.json(engine.warfarin_management(req.body || {}))));
r.post('/doac_reversal', asyncH((req, res) => res.json(engine.doac_reversal(req.body || {}))));
module.exports = r;