'use strict';
const express = require('express');
const engine = require('./tier4_card_ext_101_hf_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/classify', asyncH((req, res) => res.json(engine.classify(req.body || {}))));
r.post('/gdmt', asyncH((req, res) => res.json(engine.gdmt(req.body || {}))));
module.exports = r;