// filepath: tier5_pmrehab_ext_105_pt_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pmrehab_ext_105_pt_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ev', asyncH(async (req, res) => res.json(engine.funcs().evaluation(req.body))));
router.post('/ex', asyncH(async (req, res) => res.json(engine.funcs().exercise(req.body))));
router.post('/mn', asyncH(async (req, res) => res.json(engine.funcs().manual(req.body))));
router.post('/mod', asyncH(async (req, res) => res.json(engine.funcs().modalities(req.body))));
router.post('/home', asyncH(async (req, res) => res.json(engine.funcs().home_program(req.body))));
router.post('/prog', asyncH(async (req, res) => res.json(engine.funcs().progress(req.body))));
module.exports = router;