// filepath: tier5_ent_ext_102_laryn_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ent_ext_102_laryn_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/dys', asyncH(async (req, res) => res.json(engine.funcs().dysphonia(req.body))));
router.post('/par', asyncH(async (req, res) => res.json(engine.funcs().vocal_cord_paralysis(req.body))));
router.post('/nod', asyncH(async (req, res) => res.json(engine.funcs().nodules(req.body))));
router.post('/ref', asyncH(async (req, res) => res.json(engine.funcs().reflux(req.body))));
router.post('/ca', asyncH(async (req, res) => res.json(engine.funcs().cancer(req.body))));
router.post('/sten', asyncH(async (req, res) => res.json(engine.funcs().stenosis(req.body))));
module.exports = router;