// filepath: tier5_irad_ext_102_neuro_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_irad_ext_102_neuro_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/strk', asyncH(async (req, res) => res.json(engine.funcs().stroke(req.body))));
router.post('/aneu', asyncH(async (req, res) => res.json(engine.funcs().aneurysm(req.body))));
router.post('/avm', asyncH(async (req, res) => res.json(engine.funcs().avm(req.body))));
router.post('/carot', asyncH(async (req, res) => res.json(engine.funcs().carotid(req.body))));
router.post('/vert', asyncH(async (req, res) => res.json(engine.funcs().vertebral(req.body))));
router.post('/comp', asyncH(async (req, res) => res.json(engine.funcs().complications(req.body))));
module.exports = router;