// filepath: tier5_lab_adv_ext_102_molpath_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_lab_adv_ext_102_molpath_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/pcr', asyncH(async (req, res) => res.json(engine.funcs().pcr_result(req.body))));
router.post('/ngs', asyncH(async (req, res) => res.json(engine.funcs().ngs_panel(req.body))));
router.post('/fish', asyncH(async (req, res) => res.json(engine.funcs().fish(req.body))));
router.post('/cyto', asyncH(async (req, res) => res.json(engine.funcs().cytogenetics(req.body))));
router.post('/fish_ly', asyncH(async (req, res) => res.json(engine.funcs().fish_lymphoma(req.body))));
router.post('/ihc', asyncH(async (req, res) => res.json(engine.funcs().ihc_panel(req.body))));
module.exports = router;
