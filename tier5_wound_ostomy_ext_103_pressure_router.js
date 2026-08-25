// filepath: tier5_wound_ostomy_ext_103_pressure_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_wound_ostomy_ext_103_pressure_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/risk', asyncH(async (req, res) => res.json(engine.funcs().risk(req.body))));
router.post('/stage', asyncH(async (req, res) => res.json(engine.funcs().stage(req.body))));
router.post('/prevent', asyncH(async (req, res) => res.json(engine.funcs().prevention(req.body))));
router.post('/treat', asyncH(async (req, res) => res.json(engine.funcs().treatment(req.body))));
router.post('/pos', asyncH(async (req, res) => res.json(engine.funcs().positioning(req.body))));
router.post('/doc', asyncH(async (req, res) => res.json(engine.funcs().documentation(req.body))));
module.exports = router;
