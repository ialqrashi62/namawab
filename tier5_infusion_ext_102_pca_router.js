// filepath: tier5_infusion_ext_102_pca_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_infusion_ext_102_pca_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pca', asyncH(async (req, res) => res.json(engine.funcs().pca_assess(req.body))));
router.post('/epi', asyncH(async (req, res) => res.json(engine.funcs().epidural(req.body))));
router.post('/nrv', asyncH(async (req, res) => res.json(engine.funcs().nerve_catheter(req.body))));
router.post('/rot', asyncH(async (req, res) => res.json(engine.funcs().opioid_rotation_pca(req.body))));
router.post('/trans', asyncH(async (req, res) => res.json(engine.funcs().opioid_to_non_opioid(req.body))));
router.post('/safe', asyncH(async (req, res) => res.json(engine.funcs().pca_safety(req.body))));
module.exports = router;
