'use strict';
const express = require('express');
const engine = require('./tier4_rad_ext2_104_msk_engine');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const r = express.Router();
r.post('/fracture', asyncH((req, res) => res.json(engine.fracture(req.body || {}))));
r.post('/joint_effusion', asyncH((req, res) => res.json(engine.joint_effusion(req.body || {}))));
module.exports = r;