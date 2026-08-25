// filepath: tier5_womens_ext_102_genetics_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_womens_ext_102_genetics_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/nipt', asyncH(async (req, res) => res.json(engine.funcs().nipt(req.body))));
router.post('/amnio', asyncH(async (req, res) => res.json(engine.funcs().amnio(req.body))));
router.post('/cvs', asyncH(async (req, res) => res.json(engine.funcs().cvs(req.body))));
router.post('/carrier', asyncH(async (req, res) => res.json(engine.funcs().carrier_screening(req.body))));
router.post('/aneu', asyncH(async (req, res) => res.json(engine.funcs().aneuploidy_workup(req.body))));
router.post('/precon', asyncH(async (req, res) => res.json(engine.funcs().preconception_genetic(req.body))));
module.exports = router;
