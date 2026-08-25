// filepath: tier5_endoscopy_ext_105_uro_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_endoscopy_ext_105_uro_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/cy', asyncH(async (req, res) => res.json(engine.funcs().cysto(req.body))));
router.post('/find', asyncH(async (req, res) => res.json(engine.funcs().findings(req.body))));
router.post('/urs', asyncH(async (req, res) => res.json(engine.funcs().ureteroscopy(req.body))));
router.post('/biop', asyncH(async (req, res) => res.json(engine.funcs().biopsy(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
router.post('/post', asyncH(async (req, res) => res.json(engine.funcs().post(req.body))));
module.exports = router;