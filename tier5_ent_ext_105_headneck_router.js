// filepath: tier5_ent_ext_105_headneck_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ent_ext_105_headneck_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/mass', asyncH(async (req, res) => res.json(engine.funcs().mass(req.body))));
router.post('/st', asyncH(async (req, res) => res.json(engine.funcs().staging(req.body))));
router.post('/surg', asyncH(async (req, res) => res.json(engine.funcs().surgery(req.body))));
router.post('/rc', asyncH(async (req, res) => res.json(engine.funcs().radiochemo(req.body))));
router.post('/thy', asyncH(async (req, res) => res.json(engine.funcs().thyroid(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
module.exports = router;