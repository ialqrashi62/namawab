const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeAuthRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, activeUserSessions, bcrypt, ce, establishSession, loginLimiter, mfaConsume }) {
    const router = express.Router();
router.post('/api/auth/login', loginLimiter, async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;

        const { rows } = await pool.query('SELECT id, username, display_name, role, speciality, permissions, password_hash, failed_login_attempts, lockout_until FROM system_users WHERE username=$1 AND is_active=1', [username]);

        if (!rows.length) {

            logAudit(null, String(username).slice(0, 64), 'FAILED_LOGIN', 'Auth', 'Failed login: unknown or inactive user', clientIp);

            return res.status(401).json({ error: 'Invalid credentials' });

        }

        const user = rows[0];



        // Check if account is currently locked

        if (user.lockout_until && new Date(user.lockout_until) > new Date()) {

            const minutesLeft = Math.ceil((new Date(user.lockout_until) - new Date()) / 1000 / 60);

            logAudit(user.id, user.display_name, 'BLOCKED_LOGIN_LOCKOUT', 'Auth', `Blocked login: account is locked out for another ${minutesLeft} minutes`, clientIp);

            return res.status(403).json({ error: `تم قفل الحساب مؤقتاً بسبب محاولات دخول فاشلة متكررة. يرجى المحاولة بعد ${minutesLeft} دقيقة.` });

        }



        // Check bcrypt hash (Plaintext password fallback is disabled for security)

        let valid = false;

        if (user.password_hash && user.password_hash.startsWith('$2')) {

            valid = await bcrypt.compare(password, user.password_hash);

        }

        if (!valid) {

            const newAttempts = (user.failed_login_attempts || 0) + 1;

            let lockoutUntil = null;

            if (newAttempts >= 5) {

                lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

                await pool.query('UPDATE system_users SET failed_login_attempts = $1, lockout_until = $2 WHERE id = $3', [newAttempts, lockoutUntil, user.id]);

                logAudit(user.id, user.display_name, 'FAILED_LOGIN_LOCKOUT', 'Auth', 'Failed login: account locked out (5 attempts)', clientIp);

                return res.status(403).json({ error: 'تم قفل الحساب مؤقتاً لمدة 15 دقيقة بسبب محاولات دخول فاشلة متكررة.' });

            } else {

                await pool.query('UPDATE system_users SET failed_login_attempts = $1 WHERE id = $2', [newAttempts, user.id]);

                logAudit(user.id, user.display_name, 'FAILED_LOGIN', 'Auth', `Failed login: incorrect password (attempt ${newAttempts})`, clientIp);

                const remaining = 5 - newAttempts;

                return res.status(401).json({ error: `اسم المستخدم أو كلمة المرور غير صحيحة. المتبقي ${remaining} محاولات قبل قفل الحساب.` });

            }

        }



        // On successful authentication, reset failed attempts

        if (user.failed_login_attempts > 0 || user.lockout_until) {

            await pool.query('UPDATE system_users SET failed_login_attempts = 0, lockout_until = NULL WHERE id = $1', [user.id]);

        }



        // A2 MFA gate: if user opted into MFA, require a second factor before establishing the session.

        // Non-MFA users are unaffected (no row / mfa_enabled=false => normal login).

        const mfaRow = (await pool.query('SELECT mfa_enabled FROM user_mfa WHERE user_id=$1', [user.id])).rows[0];

        if (mfaRow && mfaRow.mfa_enabled) {

            req.session.pendingMfaUserId = user.id;

            req.session.pendingMfaAt = Date.now();

            logAudit(user.id, user.display_name, 'MFA_CHALLENGE', 'Auth', 'Password verified; awaiting second factor', clientIp);

            return res.json({ mfaRequired: true });

        }



        await establishSession(req, user, clientIp);

        res.json({ success: true, user: req.session.user });

    } catch (e) { console.error('LOGIN ERROR:', e); res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/auth/logout', (req, res) => {

    // Remove from single-session tracking

    if (req.session && req.session.user) {

        activeUserSessions.delete(req.session.user.id);

        logAudit(req.session.user.id, req.session.user.display_name, 'LOGOUT', 'Auth', 'User logged out', req.ip);

    }

    req.session.destroy();

    res.json({ success: true });

});

router.post('/api/auth/mfa', async (req, res) => {

    try {

        const uid = req.session.pendingMfaUserId;

        if (!uid) return res.status(401).json({ error: 'No pending MFA challenge' });

        if (req.session.pendingMfaAt && (Date.now() - req.session.pendingMfaAt > 5 * 60 * 1000)) { delete req.session.pendingMfaUserId; return res.status(401).json({ error: 'Challenge expired' }); }

        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;

        const { token, recoveryCode } = req.body;

        const u = (await pool.query('SELECT id, username, display_name, role, speciality, permissions FROM system_users WHERE id=$1 AND is_active=1', [uid])).rows[0];

        if (!u) { delete req.session.pendingMfaUserId; return res.status(401).json({ error: 'Invalid' }); }

        const mfa = (await pool.query('SELECT mfa_secret FROM user_mfa WHERE user_id=$1', [uid])).rows[0];

        let ok = false, via = '';

        if (token && mfa && mfaConsume(uid, ce.decryptString(mfa.mfa_secret), token)) { ok = true; via = 'totp'; }   // replay-guarded (decrypt at-rest secret)

        else if (recoveryCode) {

            const codes = (await pool.query('SELECT id, code_hash FROM user_mfa_recovery_codes WHERE user_id=$1 AND used=false', [uid])).rows;

            for (const c of codes) { if (await bcrypt.compare(String(recoveryCode).trim(), c.code_hash)) { ok = true; via = 'recovery'; await pool.query('UPDATE user_mfa_recovery_codes SET used=true WHERE id=$1', [c.id]); break; } }

        }

        if (!ok) {

            // brute-force guard: cap attempts per challenge, then force a fresh password step

            req.session.pendingMfaFails = (req.session.pendingMfaFails || 0) + 1;

            logAudit(uid, u.display_name, 'FAILED_MFA', 'Auth', 'Invalid second factor', clientIp);

            if (req.session.pendingMfaFails >= 5) { delete req.session.pendingMfaUserId; delete req.session.pendingMfaAt; delete req.session.pendingMfaFails; return res.status(429).json({ error: 'Too many attempts; please log in again' }); }

            return res.status(401).json({ error: 'Invalid code' });

        }

        delete req.session.pendingMfaUserId; delete req.session.pendingMfaAt; delete req.session.pendingMfaFails;

        await pool.query('UPDATE user_mfa SET last_verified_at=now() WHERE user_id=$1', [uid]);

        await establishSession(req, u, clientIp);

        logAudit(uid, u.display_name, 'MFA_LOGIN', 'Auth', `Second factor OK (${via})`, clientIp);

        res.json({ success: true, user: req.session.user });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/auth/me', (req, res) => {

    if (req.session && req.session.user) return res.json({ user: req.session.user });

    res.status(401).json({ error: 'Not logged in' });

});

router.put('/api/auth/change-password', requireAuth, async (req, res) => {

    try {

        const { current_password, new_password } = req.body;

        if (!current_password || !new_password) return res.status(400).json({ error: 'Missing fields' });



        const user = (await pool.query('SELECT * FROM system_users WHERE id=$1', [req.session.user.id])).rows[0];

        if (!user) return res.status(404).json({ error: 'User not found' });



        const passCheck = validatePasswordPolicy(new_password, { username: user.username });

        if (!passCheck.valid) {

            return res.status(400).json({ error: passCheck.error, error_ar: passCheck.error_ar });

        }



        // Verify current password

        const bcrypt = require('bcryptjs');

        const valid = await bcrypt.compare(current_password, user.password_hash);

        if (!valid) return res.status(401).json({ error: 'Current password is incorrect', error_ar: 'كلمة المرور الحالية غير صحيحة' });



        // Hash and update

        const hashed = await bcrypt.hash(new_password, 10);

        await pool.query('UPDATE system_users SET password_hash=$1 WHERE id=$2', [hashed, req.session.user.id]);



        logAudit(req.session.user.id, req.session.user.display_name, 'CHANGE_PASSWORD', 'Auth', 'Password changed', req.ip);

        res.json({ success: true });

    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
