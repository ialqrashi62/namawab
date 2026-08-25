// filepath: tier5_sleep_med_ext_102_pap_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_sleep_med_ext_102_pap_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/init', asyncH(async (req, res) => res.json(engine.funcs().init(req.body))));
router.post('/adh', asyncH(async (req, res) => res.json(engine.funcs().adherence(req.body))));
router.post('/ts', asyncH(async (req, res) => res.json(engine.funcs().troubleshooting(req.body))));
router.post('/eff', asyncH(async (req, res) => res.json(engine.funcs().efficacy(req.body))));
router.post('/alt', asyncH(async (req, res) => res.json(engine.funcs().alternatives(req.body))));
router.post('/dl', asyncH(async (req, res) => res.json(engine.funcs().download(req.body))));
module.exports = router;
