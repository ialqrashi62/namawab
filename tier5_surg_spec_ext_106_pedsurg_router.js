// filepath: tier5_surg_spec_ext_106_pedsurg_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_surg_spec_ext_106_pedsurg_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/nec', asyncH(async (req, res) => res.json(engine.funcs().nec(req.body))));
router.post('/gastro', asyncH(async (req, res) => res.json(engine.funcs().gastroschisis(req.body))));
router.post('/hernia', asyncH(async (req, res) => res.json(engine.funcs().hernia(req.body))));
router.post('/appy', asyncH(async (req, res) => res.json(engine.funcs().appendectomy(req.body))));
router.post('/pyloric', asyncH(async (req, res) => res.json(engine.funcs().pyloric_stenosis(req.body))));
router.post('/biliary', asyncH(async (req, res) => res.json(engine.funcs().cholangiopathy(req.body))));
module.exports = router;
