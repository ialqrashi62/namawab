// filepath: tier5_addiction_med_ext_101_screen_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_addiction_med_ext_101_screen_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/audit', asyncH(async (req, res) => res.json(engine.funcs().audit(req.body))));
router.post('/dast', asyncH(async (req, res) => res.json(engine.funcs().dast(req.body))));
router.post('/nida', asyncH(async (req, res) => res.json(engine.funcs().nida(req.body))));
router.post('/bi', asyncH(async (req, res) => res.json(engine.funcs().bi(req.body))));
router.post('/tob', asyncH(async (req, res) => res.json(engine.funcs().tobacco(req.body))));
router.post('/can', asyncH(async (req, res) => res.json(engine.funcs().cannabis(req.body))));
module.exports = router;
