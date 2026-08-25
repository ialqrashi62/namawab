// filepath: tier5_pmrehab_ext_102_tbi_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_pmrehab_ext_102_tbi_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post('/gcs', asyncH(async (req, res) => res.json(engine.funcs().gcs_assess(req.body))));
router.post('/pta', asyncH(async (req, res) => res.json(engine.funcs().pta_screen(req.body))));
router.post('/agit', asyncH(async (req, res) => res.json(engine.funcs().agitation_manage(req.body))));
router.post('/fatig', asyncH(async (req, res) => res.json(engine.funcs().fatigue_mgmt(req.body))));
router.post('/rtp', asyncH(async (req, res) => res.json(engine.funcs().rtp_sport(req.body))));
router.post('/pcs', asyncH(async (req, res) => res.json(engine.funcs().post_concussion(req.body))));
module.exports = router;
