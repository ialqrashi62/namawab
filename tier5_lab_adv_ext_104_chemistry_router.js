// filepath: tier5_lab_adv_ext_104_chemistry_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_lab_adv_ext_104_chemistry_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/tox', asyncH(async (req, res) => res.json(engine.funcs().tox_screen(req.body))));
router.post('/tdm', asyncH(async (req, res) => res.json(engine.funcs().tdm(req.body))));
router.post('/ua', asyncH(async (req, res) => res.json(engine.funcs().urinalysis(req.body))));
router.post('/fluid', asyncH(async (req, res) => res.json(engine.funcs().body_fluid(req.body))));
router.post('/horm', asyncH(async (req, res) => res.json(engine.funcs().hormone_assay(req.body))));
router.post('/tm', asyncH(async (req, res) => res.json(engine.funcs().tumor_marker(req.body))));
module.exports = router;
