// filepath: tier5_pharmacy_ext_103_safety_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pharmacy_ext_103_safety_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/medrec', asyncH(async (req, res) => res.json(engine.funcs().med_rec(req.body))));
router.post('/recon', asyncH(async (req, res) => res.json(engine.funcs().reconcile(req.body))));
router.post('/mechas', asyncH(async (req, res) => res.json(engine.funcs().mechanism_assess(req.body))));
router.post('/monitor', asyncH(async (req, res) => res.json(engine.funcs().monitoring(req.body))));
router.post('/recurring', asyncH(async (req, res) => res.json(engine.funcs().recurring_qa(req.body))));

module.exports = router;
