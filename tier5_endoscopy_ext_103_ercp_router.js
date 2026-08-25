// filepath: tier5_endoscopy_ext_103_ercp_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_endoscopy_ext_103_ercp_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ind', asyncH(async (req, res) => res.json(engine.funcs().indications(req.body))));
router.post('/cann', asyncH(async (req, res) => res.json(engine.funcs().cannulation(req.body))));
router.post('/sph', asyncH(async (req, res) => res.json(engine.funcs().sphincterotomy(req.body))));
router.post('/stone', asyncH(async (req, res) => res.json(engine.funcs().stone(req.body))));
router.post('/stent', asyncH(async (req, res) => res.json(engine.funcs().stent(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
module.exports = router;