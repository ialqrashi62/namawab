'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_infect_104_tropical_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/malaria', asyncH((req, res) => res.json(engine.malariaManagement(req.body))));
router.post('/travel', asyncH((req, res) => res.json(engine.travelVaccines(req.body))));
module.exports = router;