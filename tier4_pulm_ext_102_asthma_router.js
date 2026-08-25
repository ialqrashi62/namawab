'use strict';
const express = require('express');
const engine = require('./tier4_pulm_ext_102_asthma_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/classify', asyncH((req, res) => res.json(engine.classify(req.body || {}))));
r.post('/step', asyncH((req, res) => res.json(engine.step(req.body || {}))));
module.exports = r;