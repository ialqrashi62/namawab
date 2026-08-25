// filepath: tier5_irad_ext_103_bili_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_irad_ext_103_bili_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ptbd', asyncH(async (req, res) => res.json(engine.funcs().ptbd(req.body))));
router.post('/stent', asyncH(async (req, res) => res.json(engine.funcs().stent(req.body))));
router.post('/tips', asyncH(async (req, res) => res.json(engine.funcs().tips(req.body))));
router.post('/brto', asyncH(async (req, res) => res.json(engine.funcs().brto(req.body))));
router.post('/drain', asyncH(async (req, res) => res.json(engine.funcs().drain(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
module.exports = router;