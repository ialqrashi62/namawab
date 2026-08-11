// filepath: scripts/batch_create_routers.js
// Create routers for all 53 remaining depts
// Pattern: nm-router-middleware
'use strict';
const fs = require('fs');
const path = require('path');

const STAGING_DIR = '.ai-brain/05_ENGINES';
const LIVE_DIR = 'namaweb';

const stubs = fs.readdirSync(STAGING_DIR).filter(f => f.endsWith('_engine.js'));

function makeRouter(dept, fns) {
    return `// filepath: ${LIVE_DIR}/${dept}_router.js
// ${dept} — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./${dept}_engine');

// GET /api/${dept}/health
router.get('/health', (req, res) => res.json({ ok: true, dept: '${dept}', version: engine.VERSION }));

// GET /api/${dept}/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: '${dept}' });
        } catch (err) {
            console.error('GET /${dept}/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

${fns.map((fn, i) => `
// POST /api/${dept}/assessments/${fn}
router.post('/assessments/${fn}',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.${dept}${fn.charAt(0).toUpperCase() + fn.slice(1)} || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.${fn}(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /${dept}/${fn}', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);`).join('\n')}

module.exports = router;
`;
}

let count = 0;
for (const stubFile of stubs) {
    const dept = stubFile.replace('_engine.js', '');

    const content = fs.readFileSync(path.join(STAGING_DIR, stubFile), 'utf8');
    const fnMatches = [...content.matchAll(/^function\s+(\w+)\s*\(/gm)];
    const fns = fnMatches.map(m => m[1]).filter(fn => fn !== 'main' && !fn.startsWith('_'));

    if (fns.length === 0) continue;

    const routerCode = makeRouter(dept, fns);
    const targetPath = path.join(LIVE_DIR, `${dept}_router.js`);
    fs.writeFileSync(targetPath, routerCode);
    count++;
}

console.log(`Generated ${count} routers in ${LIVE_DIR}/`);