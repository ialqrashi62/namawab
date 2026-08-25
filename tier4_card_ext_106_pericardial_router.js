'use strict';
const express = require('express');
const engine = require('./tier4_card_ext_106_pericardial_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/tamponade', asyncH((req, res) => res.json(engine.tamponade(req.body || {}))));
r.post('/pericarditis', asyncH((req, res) => res.json(engine.pericarditis(req.body || {}))));
module.exports = r;