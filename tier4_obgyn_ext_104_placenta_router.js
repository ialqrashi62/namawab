'use strict';
const express = require('express');
const engine = require('./tier4_obgyn_ext_104_placenta_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/previa', asyncH((req, res) => res.json(engine.previa(req.body || {}))));
r.post('/accreta', asyncH((req, res) => res.json(engine.accreta(req.body || {}))));
module.exports = r;