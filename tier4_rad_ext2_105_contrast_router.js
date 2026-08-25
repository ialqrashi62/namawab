'use strict';
const express = require('express');
const engine = require('./tier4_rad_ext2_105_contrast_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/gfr_safety', asyncH((req, res) => res.json(engine.gfr_safety(req.body || {}))));
r.post('/reaction', asyncH((req, res) => res.json(engine.reaction(req.body || {}))));
module.exports = r;