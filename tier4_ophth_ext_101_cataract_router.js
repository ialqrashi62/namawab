'use strict';
const express = require('express');
const engine = require('./tier4_ophth_ext_101_cataract_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/assess', asyncH((req, res) => res.json(engine.assess(req.body || {}))));
r.post('/surgical', asyncH((req, res) => res.json(engine.surgical(req.body || {}))));
module.exports = r;