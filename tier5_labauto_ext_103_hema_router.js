// filepath: tier5_labauto_ext_103_hema_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_labauto_ext_103_hema_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/cbc', asyncH(async (req, res) => res.json(engine.funcs().cbc(req.body))));
router.post('/sm', asyncH(async (req, res) => res.json(engine.funcs().smear(req.body))));
router.post('/co', asyncH(async (req, res) => res.json(engine.funcs().coag(req.body))));
router.post('/es', asyncH(async (req, res) => res.json(engine.funcs().esr(req.body))));
router.post('/bb', asyncH(async (req, res) => res.json(engine.funcs().blood_bank(req.body))));
router.post('/q', asyncH(async (req, res) => res.json(engine.funcs().hema_quality(req.body))));
module.exports = router;