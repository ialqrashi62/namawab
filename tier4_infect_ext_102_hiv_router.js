'use strict';
const express = require('express');
const engine = require('./tier4_infect_ext_102_hiv_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/screen', asyncH((req, res) => res.json(engine.screen(req.body || {}))));
r.post('/art', asyncH((req, res) => res.json(engine.art(req.body || {}))));
module.exports = r;