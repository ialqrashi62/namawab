// filepath: tier5_endoscopy_ext_102_colon_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_endoscopy_ext_102_colon_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ind', asyncH(async (req, res) => res.json(engine.funcs().indications(req.body))));
router.post('/prep', asyncH(async (req, res) => res.json(engine.funcs().preparation(req.body))));
router.post('/int', asyncH(async (req, res) => res.json(engine.funcs().intubation(req.body))));
router.post('/pol', asyncH(async (req, res) => res.json(engine.funcs().polyps(req.body))));
router.post('/path', asyncH(async (req, res) => res.json(engine.funcs().pathology(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
module.exports = router;