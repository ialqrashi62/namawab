const fs = require('fs');
const path = require('path');
const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makePhiFilesRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, ce, upload }) {
    const router = express.Router();
router.get('/api/phi-files/:id', requireAuth, async (req, res) => {

    try {

        const id = parseInt(req.params.id, 10);

        if (!Number.isInteger(id)) return res.status(404).json({ error: 'File not found' });

        // explicit tenant scope (mirrors upload handler) — FORCE RLS is the backstop, not the sole control

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const params = tenantId ? [id, tenantId] : [id];

        const row = (await pool.query(`SELECT stored_path, original_name, encrypted FROM phi_files WHERE id=$1${tenantCheck}`, params)).rows[0];

        if (!row) return res.status(404).json({ error: 'File not found' });   // other tenants -> no row -> 404

        const vaultRoot = path.resolve(path.join(__dirname, 'phi_vault'));

        const resolved = path.resolve(row.stored_path);

        if (!resolved.startsWith(vaultRoot + path.sep) || !fs.existsSync(resolved)) return res.status(404).json({ error: 'File not found' });

        // pin Content-Type to a safe image/dicom MIME (uploads are extension-allowlisted) + block sniffing/active content

        const mimes = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.bmp': 'image/bmp', '.webp': 'image/webp', '.dcm': 'application/dicom', '.dicom': 'application/dicom' };

        const ext = path.extname(resolved).toLowerCase();

        res.setHeader('Content-Type', mimes[ext] || 'application/octet-stream');

        res.setHeader('X-Content-Type-Options', 'nosniff');

        res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");

        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(row.original_name || ('file' + ext))}"`);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'PHI_FILE_DOWNLOAD', 'PHI',

            `Downloaded phi_file #${id}`, req.ip);

        // A3: decrypt at-rest ciphertext on the fly for authorized requester (legacy plaintext served as-is)

        if (row.encrypted) {

            try { return res.send(ce.decryptToBuffer(fs.readFileSync(resolved, 'utf8'))); }

            catch (decErr) { console.error('PHI decrypt failed:', decErr.message); return res.status(500).json({ error: 'Server error' }); }

        }

        res.sendFile(resolved);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
