// filepath: tier5_surg_spec_ext_103_vascular_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_surg_spec_ext_103_vascular_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/aaa', asyncH(async (req, res) => res.json(engine.funcs().aaa(req.body))));
router.post('/carot', asyncH(async (req, res) => res.json(engine.funcs().carotid(req.body))));
router.post('/pad', asyncH(async (req, res) => res.json(engine.funcs().pad(req.body))));
router.post('/byp', asyncH(async (req, res) => res.json(engine.funcs().bypass(req.body))));
router.post('/evar', asyncH(async (req, res) => res.json(engine.funcs().evar(req.body))));
router.post('/amput', asyncH(async (req, res) => res.json(engine.funcs().amputation(req.body))));
module.exports = router;
