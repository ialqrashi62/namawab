'use strict';
const express = require('express');
const engine = require('./tier4_pulm_ext_104_osa_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/screen', asyncH((req, res) => res.json(engine.screen(req.body || {}))));
r.post('/treatment', asyncH((req, res) => res.json(engine.treatment(req.body || {}))));
module.exports = r;