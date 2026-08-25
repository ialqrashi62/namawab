// filepath: tier5_pall_care_ext2_102_hospice_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pall_care_ext2_102_hospice_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/elig', asyncH(async (req, res) => res.json(engine.funcs().eligibility(req.body))));
router.post('/enr', asyncH(async (req, res) => res.json(engine.funcs().enrollment(req.body))));
router.post('/lvl', asyncH(async (req, res) => res.json(engine.funcs().levels_care(req.body))));
router.post('/rec', asyncH(async (req, res) => res.json(engine.funcs().recertification(req.body))));
router.post('/dc', asyncH(async (req, res) => res.json(engine.funcs().discharge(req.body))));
router.post('/ber', asyncH(async (req, res) => res.json(engine.funcs().bereavement(req.body))));
module.exports = router;
