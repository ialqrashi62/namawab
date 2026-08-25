// filepath: tier5_wound_ostomy_ext_106_dfoot_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_wound_ostomy_ext_106_dfoot_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/risk', asyncH(async (req, res) => res.json(engine.funcs().risk(req.body))));
router.post('/ulcer', asyncH(async (req, res) => res.json(engine.funcs().ulcer(req.body))));
router.post('/vasc', asyncH(async (req, res) => res.json(engine.funcs().vascular(req.body))));
router.post('/neuro', asyncH(async (req, res) => res.json(engine.funcs().neuropathic(req.body))));
router.post('/off', asyncH(async (req, res) => res.json(engine.funcs().offloading(req.body))));
router.post('/charcot', asyncH(async (req, res) => res.json(engine.funcs().charcot(req.body))));
module.exports = router;
