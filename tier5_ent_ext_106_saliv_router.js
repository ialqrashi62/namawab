// filepath: tier5_ent_ext_106_saliv_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ent_ext_106_saliv_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/sal', asyncH(async (req, res) => res.json(engine.funcs().salivary(req.body))));
router.post('/tra', asyncH(async (req, res) => res.json(engine.funcs().facial_trauma(req.body))));
router.post('/ner', asyncH(async (req, res) => res.json(engine.funcs().facial_nerve(req.body))));
router.post('/sm', asyncH(async (req, res) => res.json(engine.funcs().smell_loss(req.body))));
router.post('/tin', asyncH(async (req, res) => res.json(engine.funcs().tinnitus(req.body))));
router.post('/oc', asyncH(async (req, res) => res.json(engine.funcs().oral_cavity(req.body))));
module.exports = router;