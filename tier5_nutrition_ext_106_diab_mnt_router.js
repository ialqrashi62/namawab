'use strict';
const express = require('express');
const engine = require('./tier5_nutrition_ext_106_diab_mnt_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/plan', asyncH((req, res) => res.json(engine.plan(req.body || {}))));
module.exports = r;