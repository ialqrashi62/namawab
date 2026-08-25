// filepath: tier5_womens_ext_101_reproendo_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_womens_ext_101_reproendo_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pcos', asyncH(async (req, res) => res.json(engine.funcs().pcos(req.body))));
router.post('/amen', asyncH(async (req, res) => res.json(engine.funcs().amenorrhea(req.body))));
router.post('/infert', asyncH(async (req, res) => res.json(engine.funcs().infertility(req.body))));
router.post('/reserve', asyncH(async (req, res) => res.json(engine.funcs().ovarian_reserve(req.body))));
router.post('/rloss', asyncH(async (req, res) => res.json(engine.funcs().recurrent_loss(req.body))));
router.post('/misc', asyncH(async (req, res) => res.json(engine.funcs().endocrine_misc(req.body))));
module.exports = router;
