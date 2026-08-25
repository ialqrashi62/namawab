// filepath: tier5_surg_spec_ext_104_transplant_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_surg_spec_ext_104_transplant_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/recv', asyncH(async (req, res) => res.json(engine.funcs().recipient_eval(req.body))));
router.post('/donor', asyncH(async (req, res) => res.json(engine.funcs().donor_eval(req.body))));
router.post('/immuno', asyncH(async (req, res) => res.json(engine.funcs().immunosuppression(req.body))));
router.post('/rej', asyncH(async (req, res) => res.json(engine.funcs().rejection(req.body))));
router.post('/inf', asyncH(async (req, res) => res.json(engine.funcs().infection(req.body))));
router.post('/ltf', asyncH(async (req, res) => res.json(engine.funcs().long_term_followup(req.body))));
module.exports = router;
