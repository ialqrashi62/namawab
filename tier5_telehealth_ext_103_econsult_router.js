// filepath: tier5_telehealth_ext_103_econsult_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_telehealth_ext_103_econsult_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/req', asyncH(async (req, res) => res.json(engine.funcs().request(req.body))));
router.post('/rev', asyncH(async (req, res) => res.json(engine.funcs().review(req.body))));
router.post('/qa', asyncH(async (req, res) => res.json(engine.funcs().quality(req.body))));
router.post('/clo', asyncH(async (req, res) => res.json(engine.funcs().closure(req.body))));
router.post('/sp', asyncH(async (req, res) => res.json(engine.funcs().specialist(req.body))));
router.post('/sc', asyncH(async (req, res) => res.json(engine.funcs().scaling(req.body))));
module.exports = router;
