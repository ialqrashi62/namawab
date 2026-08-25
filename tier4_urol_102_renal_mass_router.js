'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier4_urol_102_renal_mass_engine');
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
router.post('/mass', asyncH((req, res) => res.json(engine.renalMass(req.body))));
router.post('/hematuria', asyncH((req, res) => res.json(engine.hematuria(req.body))));
module.exports = router;