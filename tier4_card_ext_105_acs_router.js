'use strict';
const express = require('express');
const engine = require('./tier4_card_ext_105_acs_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/classify', asyncH((req, res) => res.json(engine.classify(req.body || {}))));
r.post('/reperfusion', asyncH((req, res) => res.json(engine.reperfusion(req.body || {}))));
module.exports = r;