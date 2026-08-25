'use strict';
const express = require('express');
const engine = require('./tier4_rad_ext2_103_neuro_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/ich', asyncH((req, res) => res.json(engine.ich(req.body || {}))));
r.post('/stroke', asyncH((req, res) => res.json(engine.stroke(req.body || {}))));
r.post('/trauma', asyncH((req, res) => res.json(engine.trauma(req.body || {}))));
module.exports = r;