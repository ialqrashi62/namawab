// filepath: tier5_oph_ext_104_cornea_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_oph_ext_104_cornea_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/dx', asyncH(async (req, res) => res.json(engine.funcs().diagnosis(req.body))));
router.post('/ker', asyncH(async (req, res) => res.json(engine.funcs().keratitis(req.body))));
router.post('/kera', asyncH(async (req, res) => res.json(engine.funcs().keratoconus(req.body))));
router.post('/dry', asyncH(async (req, res) => res.json(engine.funcs().dry_eye(req.body))));
router.post('/tx', asyncH(async (req, res) => res.json(engine.funcs().transplant(req.body))));
router.post('/ref', asyncH(async (req, res) => res.json(engine.funcs().refractive(req.body))));
module.exports = router;