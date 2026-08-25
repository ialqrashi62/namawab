// filepath: tier5_lab_adv_ext_103_hemepath_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_lab_adv_ext_103_hemepath_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/bm', asyncH(async (req, res) => res.json(engine.funcs().bm_biopsy(req.body))));
router.post('/flow', asyncH(async (req, res) => res.json(engine.funcs().flow_cytometry(req.body))));
router.post('/ln', asyncH(async (req, res) => res.json(engine.funcs().lymph_node(req.body))));
router.post('/leuk', asyncH(async (req, res) => res.json(engine.funcs().leukemia_classify(req.body))));
router.post('/lymph', asyncH(async (req, res) => res.json(engine.funcs().lymphoma_classify(req.body))));
router.post('/mm', asyncH(async (req, res) => res.json(engine.funcs().myeloma_workup(req.body))));
module.exports = router;
