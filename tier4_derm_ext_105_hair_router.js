'use strict';
const express = require('express');
const engine = require('./tier4_derm_ext_105_hair_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/alopecia', asyncH((req, res) => res.json(engine.alopecia(req.body || {}))));
r.post('/hirsutism', asyncH((req, res) => res.json(engine.hirsutism(req.body || {}))));
module.exports = r;