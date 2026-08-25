// filepath: tier5_derm_ext_102_inf_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_derm_ext_102_inf_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/cell', asyncH(async (req, res) => res.json(engine.funcs().cellulitis(req.body))));
router.post('/abs', asyncH(async (req, res) => res.json(engine.funcs().abscess(req.body))));
router.post('/fun', asyncH(async (req, res) => res.json(engine.funcs().fungal(req.body))));
router.post('/vir', asyncH(async (req, res) => res.json(engine.funcs().viral(req.body))));
router.post('/par', asyncH(async (req, res) => res.json(engine.funcs().parasitic(req.body))));
router.post('/wou', asyncH(async (req, res) => res.json(engine.funcs().wound(req.body))));
module.exports = router;