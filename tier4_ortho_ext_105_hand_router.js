'use strict';
const express = require('express');
const engine = require('./tier4_ortho_ext_105_hand_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/carpal_tunnel', asyncH((req, res) => res.json(engine.carpal_tunnel(req.body || {}))));
r.post('/trigger_finger', asyncH((req, res) => res.json(engine.trigger_finger(req.body || {}))));
module.exports = r;