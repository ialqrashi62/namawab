'use strict';
const express = require('express');
const engine = require('./tier4_derm_ext_103_eczema_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/severity', asyncH((req, res) => res.json(engine.severity(req.body || {}))));
r.post('/treatment', asyncH((req, res) => res.json(engine.treatment(req.body || {}))));
module.exports = r;