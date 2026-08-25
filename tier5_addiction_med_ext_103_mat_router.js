// filepath: tier5_addiction_med_ext_103_mat_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_addiction_med_ext_103_mat_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/bup', asyncH(async (req, res) => res.json(engine.funcs().buprenorphine(req.body))));
router.post('/meth', asyncH(async (req, res) => res.json(engine.funcs().methadone(req.body))));
router.post('/ntrx', asyncH(async (req, res) => res.json(engine.funcs().naltrexone(req.body))));
router.post('/acm', asyncH(async (req, res) => res.json(engine.funcs().acamprosate(req.body))));
router.post('/dsf', asyncH(async (req, res) => res.json(engine.funcs().disulfiram(req.body))));
router.post('/var', asyncH(async (req, res) => res.json(engine.funcs().varenicline(req.body))));
module.exports = router;
