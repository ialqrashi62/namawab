// filepath: tier5_irad_ext_104_onc_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_irad_ext_104_onc_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ablate', asyncH(async (req, res) => res.json(engine.funcs().ablation(req.body))));
router.post('/tace', asyncH(async (req, res) => res.json(engine.funcs().tace(req.body))));
router.post('/y90', asyncH(async (req, res) => res.json(engine.funcs().y90(req.body))));
router.post('/cryo', asyncH(async (req, res) => res.json(engine.funcs().cryo(req.body))));
router.post('/irev', asyncH(async (req, res) => res.json(engine.funcs().irev(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
module.exports = router;