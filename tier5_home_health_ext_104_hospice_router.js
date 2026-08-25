// filepath: tier5_home_health_ext_104_hospice_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_home_health_ext_104_hospice_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/elig', asyncH(async (req, res) => res.json(engine.funcs().hospice_eligibility_home(req.body))));
router.post('/comfort', asyncH(async (req, res) => res.json(engine.funcs().comfort_kit(req.body))));
router.post('/respite', asyncH(async (req, res) => res.json(engine.funcs().respite_care_hh(req.body))));
router.post('/vigil', asyncH(async (req, res) => res.json(engine.funcs().vigil_care(req.body))));
router.post('/bereave', asyncH(async (req, res) => res.json(engine.funcs().bereavement_home(req.body))));

module.exports = router;
