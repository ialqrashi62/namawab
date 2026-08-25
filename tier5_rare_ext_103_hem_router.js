// filepath: tier5_rare_ext_103_hem_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_rare_ext_103_hem_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/sickle', asyncH(async (req, res) => res.json(engine.funcs().sickle_assess(req.body))));
router.post('/thal', asyncH(async (req, res) => res.json(engine.funcs().thalassemia(req.body))));
router.post('/itp', asyncH(async (req, res) => res.json(engine.funcs().itp_management(req.body))));
router.post('/ttp', asyncH(async (req, res) => res.json(engine.funcs().ttp_screen(req.body))));
router.post('/vwd', asyncH(async (req, res) => res.json(engine.funcs().von_willebrand(req.body))));

module.exports = router;
