// filepath: tier5_cardiology_ext_105_acs_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_cardiology_ext_105_acs_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pres', asyncH(async (req, res) => res.json(engine.funcs().presentation(req.body))));
router.post('/fm', asyncH(async (req, res) => res.json(engine.funcs().first_medical(req.body))));
router.post('/act', asyncH(async (req, res) => res.json(engine.funcs().activation(req.body))));
router.post('/pci', asyncH(async (req, res) => res.json(engine.funcs().pci(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
router.post('/rehab', asyncH(async (req, res) => res.json(engine.funcs().cardiac_rehab(req.body))));
module.exports = router;
