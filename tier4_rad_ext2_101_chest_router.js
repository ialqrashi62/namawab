'use strict';
const express = require('express');
const engine = require('./tier4_rad_ext2_101_chest_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/cxr_interpret', asyncH((req, res) => res.json(engine.cxr_interpret(req.body || {}))));
r.post('/nodule', asyncH((req, res) => res.json(engine.nodule(req.body || {}))));
r.post('/pe', asyncH((req, res) => res.json(engine.pe(req.body || {}))));
module.exports = r;