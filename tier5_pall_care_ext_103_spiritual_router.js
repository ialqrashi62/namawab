// filepath: tier5_pall_care_ext_103_spiritual_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pall_care_ext_103_spiritual_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/hist', asyncH(async (req, res) => res.json(engine.funcs().spiritual_history(req.body))));
router.post('/distress', asyncH(async (req, res) => res.json(engine.funcs().spiritual_distress(req.body))));
router.post('/cultural', asyncH(async (req, res) => res.json(engine.funcs().cultural_practice(req.body))));
router.post('/dignity', asyncH(async (req, res) => res.json(engine.funcs().dignity_conserving(req.body))));
router.post('/meaning', asyncH(async (req, res) => res.json(engine.funcs().meaning_therapy(req.body))));
router.post('/chap', asyncH(async (req, res) => res.json(engine.funcs().chaplain_referral(req.body))));
module.exports = router;
