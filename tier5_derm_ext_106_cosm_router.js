// filepath: tier5_derm_ext_106_cosm_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_derm_ext_106_cosm_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/bot', asyncH(async (req, res) => res.json(engine.funcs().botox(req.body))));
router.post('/fill', asyncH(async (req, res) => res.json(engine.funcs().fillers(req.body))));
router.post('/las', asyncH(async (req, res) => res.json(engine.funcs().laser(req.body))));
router.post('/pe', asyncH(async (req, res) => res.json(engine.funcs().pe(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
module.exports = router;