// filepath: tier5_womens_ext_104_gynonco_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_womens_ext_104_gynonco_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/cx', asyncH(async (req, res) => res.json(engine.funcs().cervical_screening(req.body))));
router.post('/ov', asyncH(async (req, res) => res.json(engine.funcs().ovarian_mass(req.body))));
router.post('/em', asyncH(async (req, res) => res.json(engine.funcs().endometrial(req.body))));
router.post('/vul', asyncH(async (req, res) => res.json(engine.funcs().vulvar(req.body))));
router.post('/gt', asyncH(async (req, res) => res.json(engine.funcs().gestational_trophoblastic(req.body))));
router.post('/fup', asyncH(async (req, res) => res.json(engine.funcs().cancer_followup(req.body))));
module.exports = router;
