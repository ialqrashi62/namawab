/**
 * {{DEPT_NAME_EN}} — Router Template
 * NamaMedical Department
 *
 * Express router with full middleware chain:
 * - auth (JWT + MFA)
 * - tenant (extract X-Tenant-Id)
 * - rbac (verify role permission)
 * - audit (log access)
 * - validate (JSON schema)
 * - handler (call engine via service)
 *
 * @module routers/{{DEPT_SLUG}}
 */

'use strict';

const express = require('express');
const { z } = require('zod');
const engine = require('../engines/{{DEPT_SLUG}}_engine');
const service = require('../services/{{DEPT_SLUG}}_service');
const { authMiddleware } = require('../middleware/auth');
const { tenantMiddleware } = require('../middleware/tenant');
const { rbacMiddleware } = require('../middleware/rbac');
const { auditMiddleware } = require('../middleware/audit');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All routes require auth + tenant + audit
router.use(authMiddleware);
router.use(auditMiddleware('{{DEPT_SLUG}}'));

// ============= Health (no tenant required) =============
router.get('/health', (req, res) => {
  res.json({ ok: true, service: '{{DEPT_SLUG}}', ts: new Date().toISOString() });
});

// ============= Apply tenant + RBAC to remaining routes =============
router.use(tenantMiddleware);

// ============= Patients =============
router.get('/patients',
  rbacMiddleware('{{DEPT_SLUG}}:read'),
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
  rbacMiddleware('{{DEPT_SLUG}}:write'),
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
  rbacMiddleware('{{DEPT_SLUG}}:read'),
  async (req, res, next) => {
    try {
      const patient = await service.getPatient({
        id: req.params.id,
        tenantId: req.tenant.id,
        userId: req.user.id,
      });
      if (!patient) return res.status(404).json({ error: 'NOT_FOUND' });
      res.json(patient);
    } catch (err) { next(err); }
  }
);

router.patch('/patients/:id',
  rbacMiddleware('{{DEPT_SLUG}}:write'),
  validate(z.object({
    status: z.enum(['waiting', 'in_progress', 'completed', 'cancelled']).optional(),
    notes: z.string().max(5000).optional(),
    priority: z.enum(['routine', 'urgent', 'stat']).optional(),
  })),
  async (req, res, next) => {
    try {
      const patient = await service.updatePatient({
        id: req.params.id,
        ...req.body,
        tenantId: req.tenant.id,
        userId: req.user.id,
      });
      res.json(patient);
    } catch (err) { next(err); }
  }
);

router.delete('/patients/:id',
  rbacMiddleware('{{DEPT_SLUG}}:admin'),
  async (req, res, next) => {
    try {
      await service.softDeletePatient({
        id: req.params.id,
        tenantId: req.tenant.id,
        userId: req.user.id,
      });
      res.status(204).end();
    } catch (err) { next(err); }
  }
);

// ============= Assessments =============
router.post('/assessments',
  rbacMiddleware('{{DEPT_SLUG}}:write'),
  validate(z.object({
    patient_id: z.string().uuid(),
    type: z.string().min(1).max(100),
    inputs: z.record(z.any()),
    notes: z.string().max(5000).optional(),
  })),
  async (req, res, next) => {
    try {
      // 1. Run pure engine
      const engineResult = engine.{{METHOD_1}}(req.body.inputs);

      // 2. Persist
      const assessment = await service.createAssessment({
        patientId: req.body.patient_id,
        type: req.body.type,
        inputs: req.body.inputs,
        result: engineResult,
        notes: req.body.notes,
        tenantId: req.tenant.id,
        userId: req.user.id,
      });

      res.status(201).json(assessment);
    } catch (err) { next(err); }
  }
);

router.get('/assessments/:id',
  rbacMiddleware('{{DEPT_SLUG}}:read'),
  async (req, res, next) => {
    try {
      const assessment = await service.getAssessment({
        id: req.params.id,
        tenantId: req.tenant.id,
      });
      if (!assessment) return res.status(404).json({ error: 'NOT_FOUND' });
      res.json(assessment);
    } catch (err) { next(err); }
  }
);

// ============= Codes (ICD-10, CPT, SNOMED) =============
router.get('/codes',
  rbacMiddleware('{{DEPT_SLUG}}:read'),
  async (req, res, next) => {
    try {
      const codes = await service.getCodes({
        system: req.query.system,
        search: req.query.search,
        tenantId: req.tenant.id,
      });
      res.json(codes);
    } catch (err) { next(err); }
  }
);

// ============= AI Co-pilot =============
router.post('/ai/chat',
  rbacMiddleware('{{DEPT_SLUG}}:ai'),
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
        dept: '{{DEPT_SLUG}}',
      });
      res.json(answer);
    } catch (err) { next(err); }
  }
);

module.exports = router;
