// filepath: tier5_endoscopy_ext_105_eus_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_endoscopy_ext_105_eus_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ind', asyncH(async (req, res) => res.json(engine.funcs().indications(req.body))));
router.post('/st', asyncH(async (req, res) => res.json(engine.funcs().staging(req.body))));
router.post('/fna', asyncH(async (req, res) => res.json(engine.funcs().fna(req.body))));
router.post('/cyst', asyncH(async (req, res) => res.json(engine.funcs().cyst(req.body))));
router.post('/ther', asyncH(async (req, res) => res.json(engine.funcs().therapy(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
module.exports = router;