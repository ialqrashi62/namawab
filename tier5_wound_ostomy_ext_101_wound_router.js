// filepath: tier5_wound_ostomy_ext_101_wound_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_wound_ostomy_ext_101_wound_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/assess', asyncH(async (req, res) => res.json(engine.funcs().assessment(req.body))));
router.post('/stage', asyncH(async (req, res) => res.json(engine.funcs().staging(req.body))));
router.post('/dress', asyncH(async (req, res) => res.json(engine.funcs().dressing(req.body))));
router.post('/debride', asyncH(async (req, res) => res.json(engine.funcs().debridement(req.body))));
router.post('/infect', asyncH(async (req, res) => res.json(engine.funcs().infection(req.body))));
router.post('/heal', asyncH(async (req, res) => res.json(engine.funcs().healing(req.body))));
module.exports = router;
