'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_pall_ext_102_dyspnea_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/severity', asyncH((req, res) => res.json(engine.dyspneaSeverity(req.body))));
router.post('/manage', asyncH((req, res) => res.json(engine.dyspneaManagement(req.body))));
module.exports = router;