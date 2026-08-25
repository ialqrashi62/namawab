// filepath: tier5_infusion_ext_106_specialty_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_infusion_ext_106_specialty_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/bio', asyncH(async (req, res) => res.json(engine.funcs().biologic(req.body))));
router.post('/rx', asyncH(async (req, res) => res.json(engine.funcs().infusion_reaction(req.body))));
router.post('/des', asyncH(async (req, res) => res.json(engine.funcs().desensitization(req.body))));
router.post('/ert', asyncH(async (req, res) => res.json(engine.funcs().enzyme_replacement(req.body))));
router.post('/gene', asyncH(async (req, res) => res.json(engine.funcs().gene_therapy(req.body))));
router.post('/ops', asyncH(async (req, res) => res.json(engine.funcs().infusion_clinic_ops(req.body))));
module.exports = router;
