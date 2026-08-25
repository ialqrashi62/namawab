// filepath: tier5_pharmacy_ext_101_pgx_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pharmacy_ext_101_pgx_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/cyp2c19', asyncH(async (req, res) => res.json(engine.funcs().cyp2c19(req.body))));
router.post('/cyp2d6', asyncH(async (req, res) => res.json(engine.funcs().cyp2d6(req.body))));
router.post('/slco1b1', asyncH(async (req, res) => res.json(engine.funcs().slco1b1(req.body))));
router.post('/tpmt', asyncH(async (req, res) => res.json(engine.funcs().tpmt(req.body))));
router.post('/dpyd', asyncH(async (req, res) => res.json(engine.funcs().dpyd(req.body))));

module.exports = router;
