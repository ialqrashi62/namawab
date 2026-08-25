'use strict';
const express = require('express');
const engine = require('./tier4_rad_ext2_106_peds_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/dose', asyncH((req, res) => res.json(engine.dose(req.body || {}))));
r.post('/exam_choice', asyncH((req, res) => res.json(engine.exam_choice(req.body || {}))));
module.exports = r;