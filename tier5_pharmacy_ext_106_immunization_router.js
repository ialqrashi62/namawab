// filepath: tier5_pharmacy_ext_106_immunization_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pharmacy_ext_106_immunization_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/elig', asyncH(async (req, res) => res.json(engine.funcs().immunization_eligibility(req.body))));
router.post('/catchup', asyncH(async (req, res) => res.json(engine.funcs().catch_up_vaccine(req.body))));
router.post('/preg', asyncH(async (req, res) => res.json(engine.funcs().pregnancy_vaccine(req.body))));
router.post('/pe', asyncH(async (req, res) => res.json(engine.funcs().post_exposure(req.body))));
router.post('/titer', asyncH(async (req, res) => res.json(engine.funcs().immune_titer(req.body))));

module.exports = router;
