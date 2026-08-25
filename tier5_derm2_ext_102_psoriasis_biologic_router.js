// filepath: tier5_derm2_ext_102_psoriasis_biologic_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_derm2_ext_102_psoriasis_biologic_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/pasi', asyncH(async (req, res) => res.json(engine.funcs().pasi_calc(req.body))));
router.post('/select', asyncH(async (req, res) => res.json(engine.funcs().biologic_selection(req.body))));
router.post('/screen', asyncH(async (req, res) => res.json(engine.funcs().biologic_screening(req.body))));
router.post('/switch', asyncH(async (req, res) => res.json(engine.funcs().switch_biologic(req.body))));
router.post('/monitor', asyncH(async (req, res) => res.json(engine.funcs().monitoring(req.body))));

module.exports = router;
