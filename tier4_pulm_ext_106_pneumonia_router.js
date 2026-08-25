'use strict';
const express = require('express');
const engine = require('./tier4_pulm_ext_106_pneumonia_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/curb65', asyncH((req, res) => res.json(engine.curb65(req.body || {}))));
r.post('/severity', asyncH((req, res) => res.json(engine.severity(req.body || {}))));
module.exports = r;