// filepath: tier5_lab_adv_ext_106_anapath_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_lab_adv_ext_106_anapath_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/gross', asyncH(async (req, res) => res.json(engine.funcs().biopsy_gross(req.body))));
router.post('/frozen', asyncH(async (req, res) => res.json(engine.funcs().frozen_section(req.body))));
router.post('/grade', asyncH(async (req, res) => res.json(engine.funcs().tumor_grading(req.body))));
router.post('/stage', asyncH(async (req, res) => res.json(engine.funcs().staging(req.body))));
router.post('/cyto', asyncH(async (req, res) => res.json(engine.funcs().cytology(req.body))));
router.post('/stain', asyncH(async (req, res) => res.json(engine.funcs().special_stain(req.body))));
module.exports = router;
