'use strict';
const express = require('express');
const engine = require('./tier4_ortho_ext_103_shoulder_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/rotator_cuff', asyncH((req, res) => res.json(engine.rotator_cuff(req.body || {}))));
r.post('/frozen_shoulder', asyncH((req, res) => res.json(engine.frozen_shoulder(req.body || {}))));
module.exports = r;