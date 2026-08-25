// filepath: tier5_derm_ext_101_gen_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_derm_ext_101_gen_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/les', asyncH(async (req, res) => res.json(engine.funcs().lesion(req.body))));
router.post('/rash', asyncH(async (req, res) => res.json(engine.funcs().rash(req.body))));
router.post('/prur', asyncH(async (req, res) => res.json(engine.funcs().pruritus(req.body))));
router.post('/alg', asyncH(async (req, res) => res.json(engine.funcs().allergy(req.body))));
router.post('/psor', asyncH(async (req, res) => res.json(engine.funcs().psoriasis(req.body))));
router.post('/ai', asyncH(async (req, res) => res.json(engine.funcs().autoimmune_blister(req.body))));
module.exports = router;