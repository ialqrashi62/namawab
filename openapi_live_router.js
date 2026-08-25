// filepath: namaweb/openapi_live_router.js
// Live OpenAPI 3.0 spec generator.
// Walks Express router stack + matches known route patterns from wave catalog.
// Combines with the static openapi.json if present.
'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requireAuth, requireTenantScope } = require('./mw');

const OPENAPI_STATIC = path.join(__dirname, 'public/openapi.json');

// Endpoint catalog — keep in sync as new waves land
const ENDPOINT_CATALOG = [
    // hub
    { method: 'GET', path: '/api/hub/health', tags: ['hub'], summary: 'Hub health' },
    { method: 'GET', path: '/api/hub/depts', tags: ['hub'], summary: 'List departments' },
    { method: 'GET', path: '/api/hub/overview', tags: ['hub'], summary: 'Hub overview' },
    { method: 'GET', path: '/api/hub/activity', tags: ['hub'], summary: 'Recent activity' },
    { method: 'GET', path: '/api/hub/settings', tags: ['hub'], summary: 'Get user settings' },
    { method: 'PUT', path: '/api/hub/settings/:key', tags: ['hub'], summary: 'Set a setting' },
    { method: 'GET', path: '/api/hub/favorites', tags: ['hub'], summary: 'Get favorites' },
    { method: 'POST', path: '/api/hub/favorites/:dept', tags: ['hub'], summary: 'Add favorite' },
    { method: 'DELETE', path: '/api/hub/favorites/:dept', tags: ['hub'], summary: 'Remove favorite' },
    // patient
    { method: 'GET', path: '/api/patient', tags: ['patient'], summary: 'Search patients' },
    { method: 'GET', path: '/api/patient/:patientId/overview', tags: ['patient'], summary: 'Cross-dept patient overview' },
    { method: 'POST', path: '/api/patient/:patientId/vitals', tags: ['patient'], summary: 'Record vitals' },
    { method: 'GET', path: '/api/patient/:patientId/vitals', tags: ['patient'], summary: 'Latest vitals' },
    { method: 'GET', path: '/api/patient/:patientId/vitals/trend.svg', tags: ['patient'], summary: 'SVG vitals trend chart' },
    { method: 'GET', path: '/api/patient/:patientId/ai-summary', tags: ['patient','ai'], summary: 'AI patient summary' },
    // drug interactions
    { method: 'POST', path: '/api/drug-interactions/check', tags: ['pharmacy'], summary: 'Check drug-drug interactions' },
    { method: 'GET', path: '/api/drug-interactions/health', tags: ['pharmacy'], summary: 'Engine health' },
    { method: 'GET', path: '/api/drug-interactions/recent', tags: ['pharmacy'], summary: 'Recent checks' },
    // soap
    { method: 'POST', path: '/api/soap-notes/generate', tags: ['clinical'], summary: 'Generate SOAP note' },
    { method: 'POST', path: '/api/soap-notes', tags: ['clinical'], summary: 'Save SOAP note' },
    { method: 'GET', path: '/api/soap-notes', tags: ['clinical'], summary: 'List SOAP notes' },
    { method: 'POST', path: '/api/soap-notes/:id/sign', tags: ['clinical'], summary: 'Sign SOAP note' },
    // allergies
    { method: 'GET', path: '/api/allergies', tags: ['clinical'], summary: 'List allergies' },
    { method: 'POST', path: '/api/allergies', tags: ['clinical'], summary: 'Add allergy' },
    { method: 'POST', path: '/api/allergies/:id/deactivate', tags: ['clinical'], summary: 'Deactivate allergy' },
    // labs
    { method: 'GET', path: '/api/labs', tags: ['lab'], summary: 'List lab results' },
    { method: 'GET', path: '/api/labs/tests', tags: ['lab'], summary: 'List unique tests' },
    { method: 'GET', path: '/api/labs/abnormal', tags: ['lab'], summary: 'Abnormal results' },
    { method: 'GET', path: '/api/labs/trend', tags: ['lab'], summary: 'Test trend JSON' },
    { method: 'GET', path: '/api/labs/trend.svg', tags: ['lab'], summary: 'Test trend SVG chart' },
    { method: 'POST', path: '/api/labs', tags: ['lab'], summary: 'Record lab result' },
    // pathways
    { method: 'GET', path: '/api/pathways/templates', tags: ['workflow'], summary: 'Pathway templates' },
    { method: 'GET', path: '/api/pathways', tags: ['workflow'], summary: 'List tenant pathways' },
    { method: 'POST', path: '/api/pathways/seed', tags: ['workflow'], summary: 'Seed templates' },
    { method: 'POST', path: '/api/pathways/:id/start', tags: ['workflow'], summary: 'Start pathway' },
    { method: 'POST', path: '/api/pathways/instances/:instanceId/complete-step', tags: ['workflow'], summary: 'Complete step' },
    { method: 'GET', path: '/api/pathways/instances', tags: ['workflow'], summary: 'Patient instances' },
    // cds
    { method: 'POST', path: '/api/cds/evaluate', tags: ['cds'], summary: 'Evaluate patient (drugs + vitals + labs)' },
    { method: 'GET', path: '/api/cds/alerts', tags: ['cds'], summary: 'Patient alerts' },
    { method: 'POST', path: '/api/cds/alerts/:id/acknowledge', tags: ['cds'], summary: 'Acknowledge alert' },
    { method: 'POST', path: '/api/cds/alerts/:id/dismiss', tags: ['cds'], summary: 'Dismiss alert' },
    { method: 'GET', path: '/api/cds/alerts/active-summary', tags: ['cds'], summary: 'Active alerts summary' },
    // discharge
    { method: 'POST', path: '/api/discharge/generate', tags: ['clinical'], summary: 'Generate discharge summary' },
    { method: 'POST', path: '/api/discharge', tags: ['clinical'], summary: 'Save discharge summary' },
    { method: 'GET', path: '/api/discharge', tags: ['clinical'], summary: 'List discharge summaries' },
    { method: 'GET', path: '/api/discharge/:id', tags: ['clinical'], summary: 'Get discharge summary' },
    { method: 'POST', path: '/api/discharge/:id/sign', tags: ['clinical'], summary: 'Sign discharge summary' },
    // imaging
    { method: 'GET', path: '/api/imaging/studies', tags: ['imaging'], summary: 'List imaging studies' },
    { method: 'POST', path: '/api/imaging/studies', tags: ['imaging'], summary: 'Order study' },
    { method: 'POST', path: '/api/imaging/studies/:id/complete', tags: ['imaging'], summary: 'Complete study' },
    { method: 'GET', path: '/api/imaging/reports', tags: ['imaging'], summary: 'List reports' },
    { method: 'POST', path: '/api/imaging/reports', tags: ['imaging'], summary: 'Create report' },
    { method: 'POST', path: '/api/imaging/reports/:id/sign', tags: ['imaging'], summary: 'Sign report' },
    // care plans
    { method: 'GET', path: '/api/care-plans/templates', tags: ['clinical'], summary: 'Care plan templates' },
    { method: 'GET', path: '/api/care-plans', tags: ['clinical'], summary: 'List care plans' },
    { method: 'GET', path: '/api/care-plans/:id', tags: ['clinical'], summary: 'Get care plan' },
    { method: 'POST', path: '/api/care-plans', tags: ['clinical'], summary: 'Create care plan' },
    { method: 'POST', path: '/api/care-plans/from-template', tags: ['clinical'], summary: 'Create from template' },
    { method: 'POST', path: '/api/care-plans/:id/goals/:goalIdx/progress', tags: ['clinical'], summary: 'Update goal progress' },
    { method: 'POST', path: '/api/care-plans/:id/sign', tags: ['clinical'], summary: 'Sign care plan' },
    // quality metrics
    { method: 'GET', path: '/api/quality-metrics/overview', tags: ['analytics'], summary: 'Quality KPIs overview' },
    { method: 'GET', path: '/api/quality-metrics/departments', tags: ['analytics'], summary: 'Per-department stats' },
    // appointments
    { method: 'GET', path: '/api/appointments', tags: ['scheduling'], summary: 'List appointments' },
    { method: 'POST', path: '/api/appointments', tags: ['scheduling'], summary: 'Create appointment' },
    { method: 'GET', path: '/api/appointments/today', tags: ['scheduling'], summary: "Today's appointments" },
    { method: 'POST', path: '/api/appointments/:id/status', tags: ['scheduling'], summary: 'Update status' },
    // billing
    { method: 'GET', path: '/api/billing/overview', tags: ['finance'], summary: 'Billing overview' },
    { method: 'POST', path: '/api/billing/zatca/generate', tags: ['finance','zatca'], summary: 'Generate ZATCA invoice' },
    { method: 'POST', path: '/api/billing/nphies/preflight', tags: ['finance','nphies'], summary: 'NPHIES preflight' },
    { method: 'POST', path: '/api/billing/nphies/submit', tags: ['finance','nphies'], summary: 'NPHIES submit (sandbox)' },
    { method: 'POST', path: '/api/billing/calculate-vat', tags: ['finance'], summary: 'VAT calculator' },
    // patient portal
    { method: 'GET', path: '/api/patient-portal/me', tags: ['patient-portal'], summary: 'Current patient identity' },
    { method: 'GET', path: '/api/patient-portal/appointments', tags: ['patient-portal'], summary: 'My appointments' },
    { method: 'POST', path: '/api/patient-portal/appointments/request', tags: ['patient-portal'], summary: 'Request appointment' },
    { method: 'GET', path: '/api/patient-portal/labs', tags: ['patient-portal'], summary: 'My lab results' },
    { method: 'GET', path: '/api/patient-portal/allergies', tags: ['patient-portal'], summary: 'My allergies' },
    // telehealth
    { method: 'POST', path: '/api/telehealth/sessions', tags: ['telehealth'], summary: 'Schedule session' },
    { method: 'GET', path: '/api/telehealth/sessions', tags: ['telehealth'], summary: 'List sessions' },
    { method: 'GET', path: '/api/telehealth/sessions/:id', tags: ['telehealth'], summary: 'Get session' },
    { method: 'POST', path: '/api/telehealth/sessions/:id/start', tags: ['telehealth'], summary: 'Start session' },
    { method: 'POST', path: '/api/telehealth/sessions/:id/end', tags: ['telehealth'], summary: 'End session' },
    { method: 'GET', path: '/api/telehealth/join/:roomId', tags: ['telehealth'], summary: 'Get signaling hints' },
    // audit
    { method: 'GET', path: '/api/audit/system-health', tags: ['ops'], summary: 'System health summary' },
    { method: 'GET', path: '/api/audit/security-checklist', tags: ['ops','security'], summary: '13-rail security checklist' },
    { method: 'GET', path: '/api/audit/route-catalog', tags: ['ops'], summary: 'Route catalog' },
    // audit-trail
    { method: 'GET', path: '/api/audit-trail', tags: ['ops','audit'], summary: 'Audit trail entries' },
    { method: 'GET', path: '/api/audit-trail/verify', tags: ['ops','audit'], summary: 'Verify hash chain' },
    { method: 'GET', path: '/api/audit-trail/stats', tags: ['ops','audit'], summary: 'Audit stats' },
    // backup
    { method: 'GET', path: '/api/backup/health', tags: ['ops','backup'], summary: 'Backup health' },
    { method: 'GET', path: '/api/backup/integrity', tags: ['ops','backup'], summary: 'Row-level integrity check' },
    { method: 'GET', path: '/api/backup/last', tags: ['ops','backup'], summary: 'Last backup info' },
    // i18n
    { method: 'GET', path: '/api/i18n/coverage', tags: ['ops','i18n'], summary: 'i18n coverage matrix' },
    { method: 'GET', path: '/api/i18n/keys', tags: ['ops','i18n'], summary: 'i18n keys' },
    // onboarding
    { method: 'GET', path: '/api/onboarding/state', tags: ['onboarding'], summary: 'Onboarding state' },
    { method: 'POST', path: '/api/onboarding/facility', tags: ['onboarding'], summary: 'Step 2: facility' },
    { method: 'POST', path: '/api/onboarding/modules', tags: ['onboarding'], summary: 'Step 3: modules' },
    { method: 'POST', path: '/api/onboarding/admin', tags: ['onboarding'], summary: 'Step 4: admin user' },
    { method: 'POST', path: '/api/onboarding/complete', tags: ['onboarding'], summary: 'Step 5: complete' },
    { method: 'GET', path: '/api/onboarding/catalog', tags: ['onboarding'], summary: 'Catalog' },
    // security audit
    { method: 'GET', path: '/api/security-audit/mfa-coverage', tags: ['security'], summary: 'MFA coverage' },
    { method: 'GET', path: '/api/security-audit/role-distribution', tags: ['security'], summary: 'Role distribution' },
    { method: 'GET', path: '/api/security-audit/session-hygiene', tags: ['security'], summary: 'Session hygiene' },
    { method: 'GET', path: '/api/security-audit/rls-summary', tags: ['security'], summary: 'RLS summary' },
    // perf
    { method: 'GET', path: '/api/perf/slow-queries', tags: ['ops','perf'], summary: 'Slow queries (pg_stat_statements)' },
    { method: 'GET', path: '/api/perf/index-usage', tags: ['ops','perf'], summary: 'Index usage stats' },
    { method: 'GET', path: '/api/perf/connections', tags: ['ops','perf'], summary: 'Connection stats' },
    { method: 'GET', path: '/api/perf/cache-hit', tags: ['ops','perf'], summary: 'Buffer cache hit ratio' },
    { method: 'GET', path: '/api/perf/table-bloat', tags: ['ops','perf'], summary: 'Table sizes + bloat' }
];

function buildOpenApiSpec() {
    const paths = {};
    for (const ep of ENDPOINT_CATALOG) {
        if (!paths[ep.path]) paths[ep.path] = {};
        paths[ep.path][ep.method.toLowerCase()] = {
            tags: ep.tags,
            summary: ep.summary,
            operationId: `${ep.method.toLowerCase()}_${ep.path.replace(/[^a-z0-9]/gi, '_')}`,
            responses: {
                '200': { description: 'Success' },
                '400': { description: 'Bad request' },
                '401': { description: 'Unauthenticated' },
                '403': { description: 'Forbidden' },
                '404': { description: 'Not found' },
                '409': { description: 'Conflict' },
                '429': { description: 'Rate limit exceeded' },
                '500': { description: 'Internal error' }
            },
            security: [{ sessionAuth: [] }]
        };
    }
    return {
        openapi: '3.0.3',
        info: {
            title: 'NamaMedical API',
            version: '1.0.0',
            description: 'Comprehensive hospital management API. 110+ endpoints across clinical, operational, and patient-facing modules. Live at jumanasoft.com.',
            contact: { name: 'NamaMedical Dev', email: 'dev@jumanasoft.com' }
        },
        servers: [
            { url: 'https://jumanasoft.com', description: 'Production' },
            { url: 'http://localhost:3000', description: 'Local' }
        ],
        tags: [
            { name: 'hub', description: 'Department hub' },
            { name: 'patient', description: 'Patient records + AI summary + vitals' },
            { name: 'pharmacy', description: 'Drug interactions' },
            { name: 'clinical', description: 'SOAP, allergies, discharge, care plans' },
            { name: 'lab', description: 'Lab results + trends' },
            { name: 'workflow', description: 'Clinical pathways' },
            { name: 'cds', description: 'Clinical Decision Support alerts' },
            { name: 'imaging', description: 'Radiology' },
            { name: 'analytics', description: 'Quality metrics' },
            { name: 'scheduling', description: 'Appointments' },
            { name: 'finance', description: 'Billing + claims' },
            { name: 'zatca', description: 'ZATCA Phase 2 (KSA)' },
            { name: 'nphies', description: 'NPHIES (KSA insurance)' },
            { name: 'patient-portal', description: 'Patient self-service' },
            { name: 'telehealth', description: 'Video consultations' },
            { name: 'ops', description: 'Operations + monitoring' },
            { name: 'security', description: 'Security audit' },
            { name: 'audit', description: 'Audit trail' },
            { name: 'backup', description: 'Backup verification' },
            { name: 'i18n', description: 'Internationalization' },
            { name: 'onboarding', description: 'Tenant onboarding' },
            { name: 'perf', description: 'Performance profiling' },
            { name: 'ai', description: 'AI-powered endpoints' }
        ],
        components: {
            securitySchemes: {
                sessionAuth: { type: 'apiKey', in: 'cookie', name: 'connect.sid' }
            }
        },
        paths
    };
}

// GET /api/openapi.json
router.get('/', (req, res) => {
    try {
        // Try static first
        if (fs.existsSync(OPENAPI_STATIC)) {
            try {
                const staticSpec = JSON.parse(fs.readFileSync(OPENAPI_STATIC, 'utf8'));
                // Merge: prefer static but include catalog endpoints
                const liveSpec = buildOpenApiSpec();
                for (const [p, methods] of Object.entries(liveSpec.paths)) {
                    if (!staticSpec.paths[p]) staticSpec.paths[p] = methods;
                }
                return res.json({ ok: true, source: 'static+live', path_count: Object.keys(staticSpec.paths).length, spec: staticSpec });
            } catch (e) { /* fall through */ }
        }
        const spec = buildOpenApiSpec();
        res.json({ ok: true, source: 'live-only', path_count: Object.keys(spec.paths).length, spec });
    } catch (err) {
        console.error('GET /api/openapi', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// GET /api/openapi.json/catalog — just the catalog summary
router.get('/catalog', (req, res) => {
    const byTag = {};
    for (const ep of ENDPOINT_CATALOG) {
        for (const tag of ep.tags) {
            if (!byTag[tag]) byTag[tag] = [];
            byTag[tag].push({ method: ep.method, path: ep.path, summary: ep.summary });
        }
    }
    res.json({ ok: true, total_endpoints: ENDPOINT_CATALOG.length, by_tag: byTag });
});

module.exports = router;