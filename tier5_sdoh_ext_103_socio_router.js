// filepath: tier5_sdoh_ext_103_socio_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_sdoh_ext_103_socio_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/insurance', asyncH(async (req, res) => res.json(engine.funcs().insurance(req.body))));
router.post('/income', asyncH(async (req, res) => res.json(engine.funcs().income(req.body))));
router.post('/debt', asyncH(async (req, res) => res.json(engine.funcs().debt(req.body))));
router.post('/citizenship', asyncH(async (req, res) => res.json(engine.funcs().citizenship(req.body))));
router.post('/counsel', asyncH(async (req, res) => res.json(engine.funcs().financial_counseling(req.body))));

module.exports = router;
