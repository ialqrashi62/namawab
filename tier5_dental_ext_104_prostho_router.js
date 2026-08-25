// filepath: tier5_dental_ext_104_prostho_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_dental_ext_104_prostho_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/fpd', asyncH(async (req, res) => res.json(engine.funcs().fpd(req.body))));
router.post('/rpd', asyncH(async (req, res) => res.json(engine.funcs().rpd(req.body))));
router.post('/compl', asyncH(async (req, res) => res.json(engine.funcs().complete_denture(req.body))));
router.post('/overdent', asyncH(async (req, res) => res.json(engine.funcs().implant_overdenture(req.body))));
router.post('/aon4', asyncH(async (req, res) => res.json(engine.funcs().all_on_four(req.body))));
router.post('/maxillo', asyncH(async (req, res) => res.json(engine.funcs().maxillofacial_prosth(req.body))));

module.exports = router;
