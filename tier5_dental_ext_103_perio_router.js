// filepath: tier5_dental_ext_103_perio_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_dental_ext_103_perio_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/gingv', asyncH(async (req, res) => res.json(engine.funcs().gingivitis(req.body))));
router.post('/stage', asyncH(async (req, res) => res.json(engine.funcs().periodontitis_staging(req.body))));
router.post('/grade', asyncH(async (req, res) => res.json(engine.funcs().periodontitis_grading(req.body))));
router.post('/periimpl', asyncH(async (req, res) => res.json(engine.funcs().peri_implantitis(req.body))));
router.post('/gtr', asyncH(async (req, res) => res.json(engine.funcs().guided_tissue_regeneration(req.body))));
router.post('/muco', asyncH(async (req, res) => res.json(engine.funcs().mucogingival(req.body))));

module.exports = router;
