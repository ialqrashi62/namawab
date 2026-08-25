// filepath: tier5_ent_ext_104_tonsil_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_ent_ext_104_tonsil_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/strep', asyncH(async (req, res) => res.json(engine.funcs().strep(req.body))));
router.post('/hyp', asyncH(async (req, res) => res.json(engine.funcs().tonsil_hypertrophy(req.body))));
router.post('/adn', asyncH(async (req, res) => res.json(engine.funcs().adenoid(req.body))));
router.post('/quins', asyncH(async (req, res) => res.json(engine.funcs().quinsy(req.body))));
router.post('/osa', asyncH(async (req, res) => res.json(engine.funcs().sleep_apnea(req.body))));
router.post('/po', asyncH(async (req, res) => res.json(engine.funcs().postop(req.body))));
module.exports = router;