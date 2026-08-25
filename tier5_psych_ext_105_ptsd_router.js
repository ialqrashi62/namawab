// filepath: tier5_psych_ext_105_ptsd_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_psych_ext_105_ptsd_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/severity', asyncH(async (req, res) => res.json(engine.funcs().ptsd_severity(req.body))));
router.post('/cpt', asyncH(async (req, res) => res.json(engine.funcs().cpt_protocol(req.body))));
router.post('/pe', asyncH(async (req, res) => res.json(engine.funcs().prolonged_exposure(req.body))));
router.post('/crisis', asyncH(async (req, res) => res.json(engine.funcs().crisis_response(req.body))));
router.post('/dissoc', asyncH(async (req, res) => res.json(engine.funcs().dissociative_screening(req.body))));

module.exports = router;
