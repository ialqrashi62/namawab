const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeMfaRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, bcrypt, ce, mfaConsume, mfaGenSecret, mfaVerify, requireTenantAdmin }) {
    const router = express.Router();
router.get('/api/mfa/status', requireAuth, async (req, res) => {

    try {

        const r = (await pool.query('SELECT mfa_enabled FROM user_mfa WHERE user_id=$1', [req.session.user.id])).rows[0];

        res.json({ enabled: !!(r && r.mfa_enabled) });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/mfa/enroll', requireAuth, async (req, res) => {

    try {

        const uid = req.session.user.id;

        const existing = (await pool.query('SELECT mfa_enabled FROM user_mfa WHERE user_id=$1', [uid])).rows[0];

        if (existing && existing.mfa_enabled) return res.status(409).json({ error: 'MFA already enabled' });

        const secret = mfaGenSecret();

        const storedSecret = ce.isEnabled() ? ce.encryptString(secret) : secret; // encrypt at-rest when KEK configured

        await pool.query('INSERT INTO user_mfa (user_id, mfa_secret, mfa_enabled) VALUES ($1,$2,false) ON CONFLICT (user_id) DO UPDATE SET mfa_secret=$2, mfa_enabled=false, enrolled_at=NULL', [uid, storedSecret]);

        const label = encodeURIComponent('NamaMedical:' + (req.session.user.display_name || uid));

        logAudit(uid, req.session.user.display_name, 'MFA_ENROLL_START', 'Auth', 'MFA enrollment started', req.ip);

        res.json({ otpauth_url: `otpauth://totp/${label}?secret=${secret}&issuer=NamaMedical&period=30&digits=6`, secret });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/mfa/verify', requireAuth, async (req, res) => {

    try {

        const uid = req.session.user.id; const { token } = req.body;

        const row = (await pool.query('SELECT mfa_secret, mfa_enabled FROM user_mfa WHERE user_id=$1', [uid])).rows[0];

        if (!row || !row.mfa_secret) return res.status(400).json({ error: 'No enrollment in progress' });

        if (!mfaConsume(uid, ce.decryptString(row.mfa_secret), token)) return res.status(400).json({ error: 'Invalid code' }); // replay-guarded (was mfaVerify)

        const justEnabled = !row.mfa_enabled;

        await pool.query('UPDATE user_mfa SET mfa_enabled=true, enrolled_at=COALESCE(enrolled_at, now()), last_verified_at=now() WHERE user_id=$1', [uid]);

        let recovery = null;

        if (justEnabled) {

            await pool.query('DELETE FROM user_mfa_recovery_codes WHERE user_id=$1', [uid]);

            recovery = [];

            for (let i = 0; i < 8; i++) {

                const code = require('crypto').randomBytes(5).toString('hex');

                recovery.push(code);

                await pool.query('INSERT INTO user_mfa_recovery_codes (user_id, code_hash) VALUES ($1,$2)', [uid, await bcrypt.hash(code, 10)]);

            }

            logAudit(uid, req.session.user.display_name, 'MFA_ENABLED', 'Auth', 'MFA enabled (TOTP); recovery codes issued', req.ip);

        } else {

            logAudit(uid, req.session.user.display_name, 'MFA_VERIFY', 'Auth', 'MFA code verified', req.ip);

        }

        res.json({ success: true, ...(recovery ? { recovery_codes: recovery } : {}) });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/mfa/disable', requireAuth, async (req, res) => {

    try {

        const uid = req.session.user.id; const { token, password } = req.body;

        const row = (await pool.query('SELECT mfa_secret, mfa_enabled FROM user_mfa WHERE user_id=$1', [uid])).rows[0];

        if (!row || !row.mfa_enabled) return res.status(400).json({ error: 'MFA not enabled' });

        // step-up: require current password (bcrypt) in addition to a valid TOTP for this security-sensitive action

        const pw = (await pool.query('SELECT password_hash FROM system_users WHERE id=$1', [uid])).rows[0];

        if (!pw || !pw.password_hash || !pw.password_hash.startsWith('$2') || !(await bcrypt.compare(String(password || ''), pw.password_hash))) return res.status(401).json({ error: 'Password required' });

        if (!mfaVerify(ce.decryptString(row.mfa_secret), token)) return res.status(400).json({ error: 'Invalid code' });

        await pool.query('UPDATE user_mfa SET mfa_enabled=false, mfa_secret=NULL WHERE user_id=$1', [uid]);

        await pool.query('DELETE FROM user_mfa_recovery_codes WHERE user_id=$1', [uid]);

        logAudit(uid, req.session.user.display_name, 'MFA_DISABLED_SELF', 'Auth', 'User disabled own MFA', req.ip);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/mfa/admin-reset', requireAuth, requireTenantAdmin({ action: 'BLOCKED_MFA_ADMIN_RESET', module: 'Auth' }), async (req, res) => {

    try {

        const target = parseInt(req.body.userId, 10);

        if (!Number.isInteger(target)) return res.status(400).json({ error: 'userId required' });

        const tu = (await pool.query('SELECT id FROM system_users WHERE id=$1', [target])).rows[0];

        if (!tu) return res.status(404).json({ error: 'User not found' });

        await pool.query('UPDATE user_mfa SET mfa_enabled=false, mfa_secret=NULL WHERE user_id=$1', [target]);

        await pool.query('DELETE FROM user_mfa_recovery_codes WHERE user_id=$1', [target]);

        logAudit(req.session.user.id, req.session.user.display_name, 'MFA_ADMIN_RESET', 'Auth', `Admin reset MFA for user #${target}`, req.ip);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
