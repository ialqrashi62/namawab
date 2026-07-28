<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — Express Routes File

## File: 
amaweb/routes/cath_lab.js

`js
'use strict';
const express = require('express');
const router = express.Router();
const { authenticate, requireTenantScope, requireRole, validateBody, idempotencyGuard, auditMiddleware } = require('../middleware');
const RS = require('../route_schemas');
const cath = require('../controllers/cath_lab');

// Apply audit middleware to all routes
router.use(auditMiddleware);

// =============================================
// Procedures
// =============================================
router.post('/procedures',
  authenticate,
  requireTenantScope,
  requireRole('cardiology'),
  validateBody(RS.cathLab.cathProcedure),
  idempotencyGuard,  // money route
  cath.createProcedure
);

router.get('/procedures',
  authenticate,
  requireTenantScope,
  cath.listProcedures
);

router.get('/procedures/:id',
  authenticate,
  requireTenantScope,
  cath.getProcedure
);

router.patch('/procedures/:id',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.updateProcedure),
  cath.updateProcedure
);

router.post('/procedures/:id/complete',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.completeProcedure),
  cath.completeProcedure
);

router.get('/patient/:id/history',
  authenticate,
  requireTenantScope,
  cath.getPatientHistory
);

// =============================================
// PCI
// =============================================
router.post('/pci-records',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.pciRecord),
  cath.createPciRecord
);

// =============================================
// Stent Registry (SFDA, idempotent)
// =============================================
router.post('/stent-registry',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.stentImplant),
  idempotencyGuard,
  cath.registerStent
);

router.get('/stent-registry/patient/:id',
  authenticate,
  requireTenantScope,
  cath.getPatientStents
);

// =============================================
// Structural Heart MDT
// =============================================
router.get('/structural-heart/referrals',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  cath.listReferrals
);

router.post('/structural-heart/mdt',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.mdtDiscussion),
  cath.createMDT
);

router.patch('/structural-heart/mdt/:id',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.mdtDecision),
  cath.finalizeMDT
);

// =============================================
// TAVR Workup
// =============================================
router.post('/tavr-workup',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.tavrWorkup),
  cath.createTavrWorkup
);

// =============================================
// D2B Timer (idempotent)
// =============================================
router.post('/door-to-balloon-timer',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD', 'RN'),
  validateBody(RS.cathLab.d2bTimer),
  idempotencyGuard,
  cath.recordD2B
);

router.get('/door-to-balloon-timer/kpi',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD', 'QA'),
  cath.d2bKpi
);

// =============================================
// Radiation Dose
// =============================================
router.post('/radiation-dose',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD', 'RN'),
  validateBody(RS.cathLab.radiationDose),
  idempotencyGuard,
  cath.logRadiation
);

router.get('/radiation-dose/operator/:id',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD', 'QA'),
  cath.operatorDose
);

// =============================================
// Contrast
// =============================================
router.post('/contrast-tracking',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.contrastTracking),
  cath.trackContrast
);

router.get('/patient/:id/cin-risk',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  cath.cinRisk
);

// =============================================
// Scheduling
// =============================================
router.get('/scheduling/conflicts',
  authenticate,
  requireTenantScope,
  cath.checkConflicts
);

// =============================================
// Red Flags
// =============================================
router.post('/red-flag/acknowledge',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'MD'),
  validateBody(RS.cathLab.redFlag),
  cath.acknowledgeRedFlag
);

// =============================================
// Consent (idempotent)
// =============================================
router.post('/consent/sign',
  authenticate,
  requireTenantScope,
  requireRole('cardiology', 'RN'),
  validateBody(RS.cathLab.consent),
  idempotencyGuard,
  cath.signConsent
);

// =============================================
// Equipment
// =============================================
router.get('/equipment/:id/availability',
  authenticate,
  requireTenantScope,
  cath.equipmentAvailability
);

module.exports = router;
`

## Mounting in server.js
`js
app.use('/api/v1/cath-lab', require('./routes/cath_lab'));
`

---
*Section 31 of CARD-002. SA voice. L1 DRAFT.*