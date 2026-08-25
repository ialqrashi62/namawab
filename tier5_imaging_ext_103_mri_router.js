// filepath: tier5_imaging_ext_103_mri_router.js
'use strict';
const express = require('express');
const router = express.Router();
const engine = require('./tier5_imaging_ext_103_mri_engine.js');
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/dwi', asyncH(async (req, res) => res.json(engine.funcs().dwi_stroke(req.body))));
router.post('/contrast', asyncH(async (req, res) => res.json(engine.funcs().contrast_mri(req.body))));
router.post('/msk', asyncH(async (req, res) => res.json(engine.funcs().msk_mri(req.body))));
router.post('/cardiac', asyncH(async (req, res) => res.json(engine.funcs().cardiac_mri(req.body))));
router.post('/fmri', asyncH(async (req, res) => res.json(engine.funcs().fmri_brain(req.body))));
router.post('/spectro', asyncH(async (req, res) => res.json(engine.funcs().mr_spectroscopy(req.body))));

module.exports = router;
