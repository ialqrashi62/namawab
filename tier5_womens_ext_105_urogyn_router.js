// filepath: tier5_womens_ext_105_urogyn_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_womens_ext_105_urogyn_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/stress', asyncH(async (req, res) => res.json(engine.funcs().stress_incontinence(req.body))));
router.post('/urge', asyncH(async (req, res) => res.json(engine.funcs().urge_incontinence(req.body))));
router.post('/prol', asyncH(async (req, res) => res.json(engine.funcs().prolapse(req.body))));
router.post('/uti', asyncH(async (req, res) => res.json(engine.funcs().recurrent_uti(req.body))));
router.post('/fist', asyncH(async (req, res) => res.json(engine.funcs().fistula(req.body))));
router.post('/pess', asyncH(async (req, res) => res.json(engine.funcs().pessary(req.body))));
module.exports = router;
