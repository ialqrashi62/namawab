// filepath: tier5_womens_ext_103_mfm_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_womens_ext_103_mfm_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pe', asyncH(async (req, res) => res.json(engine.funcs().preeclampsia(req.body))));
router.post('/gdm', asyncH(async (req, res) => res.json(engine.funcs().gdm(req.body))));
router.post('/ptl', asyncH(async (req, res) => res.json(engine.funcs().preterm_labor(req.body))));
router.post('/mult', asyncH(async (req, res) => res.json(engine.funcs().multiples(req.body))));
router.post('/cx', asyncH(async (req, res) => res.json(engine.funcs().cervical_insufficiency(req.body))));
router.post('/fgr', asyncH(async (req, res) => res.json(engine.funcs().fetal_growth(req.body))));
module.exports = router;
