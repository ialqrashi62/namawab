// filepath: tier5_endoscopy_ext_104_capsule_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_endoscopy_ext_104_capsule_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/ind', asyncH(async (req, res) => res.json(engine.funcs().indications(req.body))));
router.post('/prep', asyncH(async (req, res) => res.json(engine.funcs().prep(req.body))));
router.post('/find', asyncH(async (req, res) => res.json(engine.funcs().findings(req.body))));
router.post('/ret', asyncH(async (req, res) => res.json(engine.funcs().retention(req.body))));
router.post('/fu', asyncH(async (req, res) => res.json(engine.funcs().followup(req.body))));
router.post('/rec', asyncH(async (req, res) => res.json(engine.funcs().record(req.body))));
module.exports = router;