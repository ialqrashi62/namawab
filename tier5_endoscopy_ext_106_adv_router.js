// filepath: tier5_endoscopy_ext_106_adv_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_endoscopy_ext_106_adv_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/bleed', asyncH(async (req, res) => res.json(engine.funcs().bleed(req.body))));
router.post('/dil', asyncH(async (req, res) => res.json(engine.funcs().dilation(req.body))));
router.post('/stent', asyncH(async (req, res) => res.json(engine.funcs().stent(req.body))));
router.post('/ent', asyncH(async (req, res) => res.json(engine.funcs().enteral(req.body))));
router.post('/ent2', asyncH(async (req, res) => res.json(engine.funcs().entoscopy(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
module.exports = router;