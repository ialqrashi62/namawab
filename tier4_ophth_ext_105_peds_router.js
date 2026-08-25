'use strict';
const express = require('express');
const engine = require('./tier4_ophth_ext_105_peds_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/strabismus', asyncH((req, res) => res.json(engine.strabismus(req.body || {}))));
r.post('/amblyopia', asyncH((req, res) => res.json(engine.amblyopia(req.body || {}))));
module.exports = r;