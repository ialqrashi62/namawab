'use strict';
const express = require('express');
const engine = require('./tier4_ophth_ext_103_retina_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/dr', asyncH((req, res) => res.json(engine.dr(req.body || {}))));
r.post('/amd', asyncH((req, res) => res.json(engine.amd(req.body || {}))));
r.post('/retinal_detachment', asyncH((req, res) => res.json(engine.retinal_detachment(req.body || {}))));
module.exports = r;