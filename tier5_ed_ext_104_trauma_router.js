// filepath: tier5_ed_ext_104_trauma_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ed_ext_104_trauma_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/primary', asyncH(async (req, res) => res.json(engine.funcs().primary_survey(req.body))));
router.post('/secondary', asyncH(async (req, res) => res.json(engine.funcs().secondary_survey(req.body))));
router.post('/mech', asyncH(async (req, res) => res.json(engine.funcs().mechanism(req.body))));
router.post('/dispo', asyncH(async (req, res) => res.json(engine.funcs().disposition(req.body))));
router.post('/pain', asyncH(async (req, res) => res.json(engine.funcs().pain_mgmt_trauma(req.body))));
router.post('/tetanus', asyncH(async (req, res) => res.json(engine.funcs().tetanus_immunization(req.body))));

module.exports = router;
