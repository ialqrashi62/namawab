/**
 * Family Medicine — Router
 * NamaMedical Department
 */

'use strict';

const express = require('express');
const { z } = require('zod');
const engine = require('./engine.js');
const service = require('./service.js');
const { authMiddleware } = require('../middleware/auth');
const { tenantMiddleware } = require('../middleware/tenant');
const { rbacMiddleware } = require('../middleware/rbac');
const { auditMiddleware } = require('../middleware/audit');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.use(authMiddleware);
router.use(auditMiddleware('family-medicine'));

router.get('/health', (req, res) => {
  res.json({ ok: true, service: 'family-medicine', ts: new Date().toISOString() });
});

router.use(tenantMiddleware);

// ============= Patients =============
router.get('/patients',
  rbacMiddleware('family-medicine:read'),
  validate(z.object({
    page: z.coerce.number().int().min(1).default(1),
    page_size: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(['waiting', 'in_progress', 'completed', 'cancelled']).optional(),
    priority: z.enum(['routine', 'urgent', 'stat']).optional(),
  }), 'query'),
  async (req, res, next) => {
    try {
      const result = await service.listPatients({
        ...req.query,
        tenantId: req.tenant.id,
        userId: req.user.id,
      });
      res.json(result);
    } catch (err) { next(err); }
  }
);

router.post('/patients',
  rbacMiddleware('family-medicine:write'),
  validate(z.object({
    national_id: z.string().min(10).max(10),
    full_name_ar: z.string().min(1).max(200),
    full_name_en: z.string().min(1).max(200).optional(),
    dob: z.string().date(),
    gender: z.enum(['male', 'female', 'other']),
    phone: z.string().optional(),
    priority: z.enum(['routine', 'urgent', 'stat']).default('routine'),
  })),
  async (req, res, next) => {
    try {
      const patient = await service.createPatient({
        ...req.body,
        tenantId: req.tenant.id,
        userId: req.user.id,
      });
      res.status(201).json(patient);
    } catch (err) { next(err); }
  }
);

router.get('/patients/:id',
  rbacMiddleware('family-medicine:read'),
  async (req, res, next) => {
    try {
      const patient = await service.getPatient({
        id: req.params.id, tenantId: req.tenant.id, userId: req.user.id,
      });
      if (!patient) return res.status(404).json({ error: 'NOT_FOUND' });
      res.json(patient);
    } catch (err) { next(err); }
  }
);

// ============= Assessments =============
router.post('/assessments/ascvd',
  rbacMiddleware('family-medicine:write'),
  validate(z.object({
    patient_id: z.string().uuid(),
    age: z.number().int().min(30).max(79),
    gender: z.enum(['male', 'female']),
    total_cholesterol: z.number().positive(),
    hdl_cholesterol: z.number().positive(),
    systolic_bp: z.number().positive(),
    on_bp_treatment: z.boolean().default(false),
    smoker: z.boolean().default(false),
    diabetes: z.boolean().default(false),
    notes: z.string().max(5000).optional(),
  })),
  async (req, res, next) => {
    try {
      const { patient_id, notes, ...inputs } = req.body;
      const engineResult = engine.ascvdRisk(inputs);
      const assessment = await service.createAssessment({
        patientId: patient_id,
        type: 'ascvd_risk',
        inputs,
        result: engineResult,
        notes,
        tenantId: req.tenant.id,
        userId: req.user.id,
      });
      res.status(201).json(assessment);
    } catch (err) { next(err); }
  }
);

router.post('/assessments/diabetes',
  rbacMiddleware('family-medicine:write'),
  validate(z.object({
    patient_id: z.string().uuid(),
    age: z.number().int().min(18).max(100),
    gender: z.enum(['male', 'female']),
    bmi: z.number().positive(),
    waist_circumference_cm: z.number().positive(),
    family_history_diabetes: z.boolean().default(false),
    history_high_blood_sugar: z.boolean().default(false),
    physically_active: z.boolean().default(true),
    notes: z.string().max(5000).optional(),
  })),
  async (req, res, next) => {
    try {
      const { patient_id, notes, ...inputs } = req.body;
      const engineResult = engine.diabetesRisk(inputs);
      const assessment = await service.createAssessment({
        patientId: patient_id, type: 'diabetes_risk',
        inputs, result: engineResult, notes,
        tenantId: req.tenant.id, userId: req.user.id,
      });
      res.status(201).json(assessment);
    } catch (err) { next(err); }
  }
);

router.post('/assessments/smoking-cessation',
  rbacMiddleware('family-medicine:write'),
  validate(z.object({
    patient_id: z.string().uuid(),
    currently_smokes: z.boolean(),
    cigarettes_per_day: z.number().int().min(0).max(100).optional(),
    years_smoking: z.number().int().min(0).max(100).optional(),
    minutes_to_first_cigarette: z.number().int().min(0).optional(),
    notes: z.string().max(5000).optional(),
  })),
  async (req, res, next) => {
    try {
      const { patient_id, notes, ...inputs } = req.body;
      const engineResult = engine.smokingCessation(inputs);
      const assessment = await service.createAssessment({
        patientId: patient_id, type: 'smoking_cessation',
        inputs, result: engineResult, notes,
        tenantId: req.tenant.id, userId: req.user.id,
      });
      res.status(201).json(assessment);
    } catch (err) { next(err); }
  }
);

router.post('/assessments/wellness',
  rbacMiddleware('family-medicine:write'),
  validate(z.object({
    patient_id: z.string().uuid(),
    age: z.number().int().min(0).max(120),
    gender: z.enum(['male', 'female']),
    family_history: z.array(z.string()).default([]),
    personal_history: z.array(z.string()).default([]),
    notes: z.string().max(5000).optional(),
  })),
  async (req, res, next) => {
    try {
      const { patient_id, notes, ...inputs } = req.body;
      const engineResult = engine.wellnessScreenings(inputs);
      const assessment = await service.createAssessment({
        patientId: patient_id, type: 'wellness_screenings',
        inputs, result: engineResult, notes,
        tenantId: req.tenant.id, userId: req.user.id,
      });
      res.status(201).json(assessment);
    } catch (err) { next(err); }
  }
);

router.get('/assessments/:id',
  rbacMiddleware('family-medicine:read'),
  async (req, res, next) => {
    try {
      const assessment = await service.getAssessment({
        id: req.params.id, tenantId: req.tenant.id,
      });
      if (!assessment) return res.status(404).json({ error: 'NOT_FOUND' });
      res.json(assessment);
    } catch (err) { next(err); }
  }
);

// ============= AI Co-pilot =============
router.post('/ai/chat',
  rbacMiddleware('family-medicine:ai'),
  validate(z.object({
    message: z.string().min(1).max(2000),
    context: z.record(z.any()).optional(),
    locale: z.enum(['ar', 'en', 'fr', 'ur']).default('ar'),
  })),
  async (req, res, next) => {
    try {
      const answer = await service.aiChat({
        message: req.body.message,
        context: req.body.context,
        locale: req.body.locale,
        tenantId: req.tenant.id,
        userId: req.user.id,
        dept: 'family-medicine',
      });
      res.json(answer);
    } catch (err) { next(err); }
  }
);

module.exports = router;
