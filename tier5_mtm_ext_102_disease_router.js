// filepath: tier5_mtm_ext_102_disease_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_mtm_ext_102_disease_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/dm', asyncH(async (req, res) => res.json(engine.funcs().diabetes_mtm(req.body))));
router.post('/htn', asyncH(async (req, res) => res.json(engine.funcs().htn_mtm(req.body))));
router.post('/asthma', asyncH(async (req, res) => res.json(engine.funcs().asthma_mtm(req.body))));
router.post('/chf', asyncH(async (req, res) => res.json(engine.funcs().chf_mtm(req.body))));
router.post('/copd', asyncH(async (req, res) => res.json(engine.funcs().copd_mtm(req.body))));
router.post('/lipid', asyncH(async (req, res) => res.json(engine.funcs().dyslipidemia_mtm(req.body))));

module.exports = router;
