'use strict';
const express = require('express');
const engine = require('./tier4_rad_ext2_102_abdomen_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/free_air', asyncH((req, res) => res.json(engine.free_air(req.body || {}))));
r.post('/obstruction', asyncH((req, res) => res.json(engine.obstruction(req.body || {}))));
r.post('/mass', asyncH((req, res) => res.json(engine.mass(req.body || {}))));
module.exports = r;