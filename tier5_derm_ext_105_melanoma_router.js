// filepath: tier5_derm_ext_105_melanoma_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_derm_ext_105_melanoma_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/biop', asyncH(async (req, res) => res.json(engine.funcs().biopsy(req.body))));
router.post('/path', asyncH(async (req, res) => res.json(engine.funcs().pathology(req.body))));
router.post('/st', asyncH(async (req, res) => res.json(engine.funcs().staging(req.body))));
router.post('/surg', asyncH(async (req, res) => res.json(engine.funcs().surgery(req.body))));
router.post('/sys', asyncH(async (req, res) => res.json(engine.funcs().systemic(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
module.exports = router;