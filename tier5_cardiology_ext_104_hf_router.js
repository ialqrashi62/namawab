// filepath: tier5_cardiology_ext_104_hf_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_cardiology_ext_104_hf_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/dx', asyncH(async (req, res) => res.json(engine.funcs().diagnosis(req.body))));
router.post('/ph', asyncH(async (req, res) => res.json(engine.funcs().phenotyping(req.body))));
router.post('/gd', asyncH(async (req, res) => res.json(engine.funcs().gdgmt(req.body))));
router.post('/de', asyncH(async (req, res) => res.json(engine.funcs().decompensation(req.body))));
router.post('/adv', asyncH(async (req, res) => res.json(engine.funcs().advanced(req.body))));
router.post('/mon', asyncH(async (req, res) => res.json(engine.funcs().monitoring(req.body))));
module.exports = router;
