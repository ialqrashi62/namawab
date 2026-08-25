// filepath: tier5_nephrology_ext_101_ckd_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_nephrology_ext_101_ckd_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/st', asyncH(async (req, res) => res.json(engine.funcs().stage(req.body))));
router.post('/alb', asyncH(async (req, res) => res.json(engine.funcs().albuminuria(req.body))));
router.post('/prog', asyncH(async (req, res) => res.json(engine.funcs().progression(req.body))));
router.post('/bp', asyncH(async (req, res) => res.json(engine.funcs().bp(req.body))));
router.post('/met', asyncH(async (req, res) => res.json(engine.funcs().metabolic(req.body))));
router.post('/an', asyncH(async (req, res) => res.json(engine.funcs().anemia(req.body))));
module.exports = router;