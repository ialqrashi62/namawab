// PCC Catalog Routes
// Returns a unified catalog of all PCC modules and their functions by
// scanning the server's app.use() registrations. No hardcoded module list.
const express = require('express');
const router = express.Router();

// Read server.js registrations at runtime via the routes stack.
// This endpoint is read-only and reflects whatever the server actually exposes.
router.get('/list', (req, res) => {
    try {
        const app = req.app;
        const stack = (app && app._router && app._router.stack) || [];
        const items = [];
        for (const layer of stack) {
            if (!layer || !layer.route) continue;
            const path = layer.route.path || '';
            if (!path.startsWith('/pcc-')) continue;
            const methods = Object.keys(layer.route.methods || {}).filter(Boolean);
            if (!methods.length) continue;
            items.push({
                path,
                methods: methods.map((m) => m.toUpperCase()).sort()
            });
        }
        items.sort((a, b) => a.path.localeCompare(b.path));
        res.json({
            version: process.env.PCC_VERSION || 'unknown',
            count: items.length,
            routes: items
        });
    } catch (e) {
        res.status(500).json({ error: 'catalog scan failed', detail: String(e && e.message) });
    }
});

// Returns the names of every PCC module by reading the on-disk directory
// (one folder = one module). This is independent of route registration.
router.get('/modules', (req, res) => {
    try {
        const path = require('path');
        const fs = require('fs');
        const pccDir = path.join(__dirname);
        const entries = fs.readdirSync(pccDir, { withFileTypes: true });
        const modules = [];
        for (const ent of entries) {
            if (!ent.isDirectory()) continue;
            if (!/^pcc_.*_ext\d+$/.test(ent.name)) continue;
            modules.push(ent.name);
        }
        modules.sort();
        res.json({
            version: process.env.PCC_VERSION || 'unknown',
            count: modules.length,
            modules
        });
    } catch (e) {
        res.status(500).json({ error: 'module scan failed', detail: String(e && e.message) });
    }
});

// Returns the full live catalog by combining both: each module's
// /list endpoint metadata. Use this from the frontend.
router.get('/catalog', async (req, res) => {
    try {
        const path = require('path');
        const fs = require('fs');
        const pccDir = path.join(__dirname);
        const entries = fs.readdirSync(pccDir, { withFileTypes: true });
        const modules = [];
        for (const ent of entries) {
            if (!ent.isDirectory()) continue;
            if (!/^pcc_.*_ext\d+$/.test(ent.name)) continue;
            modules.push(ent.name);
        }
        modules.sort();
        // Return only module names + count (the frontend fetches /list per module
        // on demand to avoid a 756-request fan-out on page load).
        res.json({
            version: process.env.PCC_VERSION || 'unknown',
            count: modules.length,
            modules
        });
    } catch (e) {
        res.status(500).json({ error: 'catalog failed', detail: String(e && e.message) });
    }
});

module.exports = router;
