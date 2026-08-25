'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pall_ext_103_nausea_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/cause', asyncH((req, res) => res.json(engine.nauseaCausePathway(req.body))));
router.post('/treat', asyncH((req, res) => res.json(engine.nauseaTreatment(req.body))));
module.exports = router;