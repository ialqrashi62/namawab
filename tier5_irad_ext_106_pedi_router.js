// filepath: tier5_irad_ext_106_pedi_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_irad_ext_106_pedi_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/angio', asyncH(async (req, res) => res.json(engine.funcs().angio(req.body))));
router.post('/biop', asyncH(async (req, res) => res.json(engine.funcs().biopsy(req.body))));
router.post('/drain', asyncH(async (req, res) => res.json(engine.funcs().drainage(req.body))));
router.post('/gast', asyncH(async (req, res) => res.json(engine.funcs().gastrostomy(req.body))));
router.post('/sed', asyncH(async (req, res) => res.json(engine.funcs().sedation(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
module.exports = router;