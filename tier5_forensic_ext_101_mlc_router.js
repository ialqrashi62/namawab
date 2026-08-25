// filepath: tier5_forensic_ext_101_mlc_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_forensic_ext_101_mlc_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/register', asyncH(async (req, res) => res.json(engine.funcs().mlc_registration(req.body))));
router.post('/dc', asyncH(async (req, res) => res.json(engine.funcs().death_certificate_check(req.body))));
router.post('/autopsy', asyncH(async (req, res) => res.json(engine.funcs().autopsy_recommendation(req.body))));
router.post('/chain', asyncH(async (req, res) => res.json(engine.funcs().evidence_chain(req.body))));
router.post('/writing', asyncH(async (req, res) => res.json(engine.funcs().medico_legal_writing(req.body))));

module.exports = router;
