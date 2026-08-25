// filepath: tier5_pmrehab_ext_105_burn_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pmrehab_ext_105_burn_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/tbsa', asyncH(async (req, res) => res.json(engine.funcs().tbsa_assess(req.body))));
router.post('/rom', asyncH(async (req, res) => res.json(engine.funcs().rom_mgmt(req.body))));
router.post('/hscar', asyncH(async (req, res) => res.json(engine.funcs().hypertrophic_scar(req.body))));
router.post('/pos', asyncH(async (req, res) => res.json(engine.funcs().positioning(req.body))));
router.post('/rtw', asyncH(async (req, res) => res.json(engine.funcs().return_to_work(req.body))));
router.post('/prur', asyncH(async (req, res) => res.json(engine.funcs().pruritus(req.body))));
module.exports = router;
