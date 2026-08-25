'use strict';
const express = require('express');
const engine = require('./tier4_ophth_ext_102_glaucoma_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/classify', asyncH((req, res) => res.json(engine.classify(req.body || {}))));
r.post('/treat', asyncH((req, res) => res.json(engine.treat(req.body || {}))));
module.exports = r;