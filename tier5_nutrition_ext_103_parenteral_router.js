'use strict';
const express = require('express');
const engine = require('./tier5_nutrition_ext_103_parenteral_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/compound', asyncH((req, res) => res.json(engine.tpn_compound(req.body || {}))));
module.exports = r;