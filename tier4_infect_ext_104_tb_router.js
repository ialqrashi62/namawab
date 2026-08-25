'use strict';
const express = require('express');
const engine = require('./tier4_infect_ext_104_tb_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/screen', asyncH((req, res) => res.json(engine.screen(req.body || {}))));
r.post('/interpret', asyncH((req, res) => res.json(engine.interpret(req.body || {}))));
module.exports = r;