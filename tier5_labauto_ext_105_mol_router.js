// filepath: tier5_labauto_ext_105_mol_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_labauto_ext_105_mol_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pcr', asyncH(async (req, res) => res.json(engine.funcs().pcr(req.body))));
router.post('/ngs', asyncH(async (req, res) => res.json(engine.funcs().ngs(req.body))));
router.post('/fish', asyncH(async (req, res) => res.json(engine.funcs().fish(req.body))));
router.post('/cyto', asyncH(async (req, res) => res.json(engine.funcs().cytogenetics(req.body))));
router.post('/rep', asyncH(async (req, res) => res.json(engine.funcs().reporting_mol(req.body))));
router.post('/qc', asyncH(async (req, res) => res.json(engine.funcs().qc_mol(req.body))));
module.exports = router;