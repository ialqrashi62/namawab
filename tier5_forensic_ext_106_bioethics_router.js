// filepath: tier5_forensic_ext_106_bioethics_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_forensic_ext_106_bioethics_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/capacity', asyncH(async (req, res) => res.json(engine.funcs().capacity(req.body))));
router.post('/surrogate', asyncH(async (req, res) => res.json(engine.funcs().surrogate_decisions(req.body))));
router.post('/dnr', asyncH(async (req, res) => res.json(engine.funcs().dnr(req.body))));
router.post('/dispute', asyncH(async (req, res) => res.json(engine.funcs().clinical_dispute(req.body))));
router.post('/transplant', asyncH(async (req, res) => res.json(engine.funcs().transplant_ethics(req.body))));

module.exports = router;
