const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeSettingsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, bcrypt, ROLE_PERMISSIONS, userLimitGuard, requireTenantContext, requireTenantAdmin, createSystemUserWithTenantLink, validatePasswordPolicy }) {
    const router = express.Router();
router.get('/api/settings/integrations', requireAuth, requireTenantContext, async (req, res) => {

    try {

        const tenantId = req.tenantId;

        const result = await pool.query('SELECT * FROM integration_settings WHERE tenant_id = $1', [tenantId]);

        res.json(result.rows);

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/settings/integrations', requireAuth, requireTenantContext, async (req, res) => {

    try {

        const tenantId = req.tenantId;

        const { integration_name, provider, api_key, api_secret, endpoint_url, is_enabled, config_json } = req.body;

        if (!integration_name) return res.status(400).json({ error: 'Missing integration_name' });



        // Validate JSON

        try {

            JSON.parse(config_json || '{}');

        } catch (_) {

            return res.status(400).json({ error: 'Invalid config_json format' });

        }



        // Check if integration exists

        const exists = (await pool.query('SELECT id FROM integration_settings WHERE tenant_id = $1 AND integration_name = $2', [tenantId, integration_name])).rows[0];

        if (exists) {

            await pool.query(

                `UPDATE integration_settings 

                 SET provider = $1, api_key = $2, api_secret = $3, endpoint_url = $4, is_enabled = $5, config_json = $6, last_sync = CURRENT_TIMESTAMP

                 WHERE tenant_id = $7 AND integration_name = $8`,

                [provider, api_key, api_secret, endpoint_url, parseInt(is_enabled) || 0, config_json || '{}', tenantId, integration_name]

            );

        } else {

            await pool.query(

                `INSERT INTO integration_settings (tenant_id, integration_name, provider, api_key, api_secret, endpoint_url, is_enabled, config_json, last_sync)

                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,

                [tenantId, integration_name, provider, api_key, api_secret, endpoint_url, parseInt(is_enabled) || 0, config_json || '{}']

            );

        }



        logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_INTEGRATION_SETTINGS', 'Settings', `Updated integration ${integration_name} settings`, req.ip);

        res.json({ success: true });

    } catch (e) {

        console.error(e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/settings/integrations/ping', requireAuth, requireTenantContext, async (req, res) => {

    try {

        const tenantId = req.tenantId;

        const { integration_name } = req.body;

        if (!integration_name) return res.status(400).json({ error: 'Missing integration_name' });



        const settings = (await pool.query('SELECT * FROM integration_settings WHERE tenant_id = $1 AND integration_name = $2', [tenantId, integration_name])).rows[0];

        if (!settings || !settings.endpoint_url) {

            return res.status(400).json({ error: 'No endpoint URL configured for this integration' });

        }



        const controller = new AbortController();

        const timeoutId = setTimeout(() => controller.abort(), 3000);



        try {

            const response = await fetch(settings.endpoint_url, {

                method: 'HEAD',

                signal: controller.signal

            }).catch(async (e) => {

                return await fetch(settings.endpoint_url, {

                    method: 'GET',

                    signal: controller.signal

                });

            });

            

            clearTimeout(timeoutId);



            return res.json({

                success: response.ok,

                status: response.status,

                statusText: response.statusText,

                message: `Connection successful: ${response.status} ${response.statusText}`

            });

        } catch (fetchError) {

            clearTimeout(timeoutId);

            return res.json({

                success: false,

                message: fetchError.name === 'AbortError' ? 'Connection timed out (3s)' : `Connection failed: ${fetchError.message}`

            });

        }

    } catch (e) {

        console.error(e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/settings', requireAuth, async (req, res) => {

    try {

        const rows = (await pool.query('SELECT * FROM company_settings')).rows;

        const settings = {};

        rows.forEach(r => settings[r.setting_key] = r.setting_value);

        res.json(settings);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/settings', requireAuth, requireRole('settings'), async (req, res) => {

    try {

        const updates = req.body;

        for (const [key, value] of Object.entries(updates)) {

            await pool.query('INSERT INTO company_settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value=$2', [key, value]);

        }

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/settings/users', requireAuth, requireRole('settings'), async (req, res) => {

    try { res.json((await pool.query('SELECT id, username, display_name, role, speciality, permissions, commission_type, commission_value, is_active, last_ip, created_at FROM system_users ORDER BY id')).rows); }

    catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/settings/users', requireAuth, requireRole('settings'), requireTenantAdmin({ action: 'BLOCKED_USER_CREATE', module: 'Settings' }), userLimitGuard, async (req, res) => {

    const { username, password, display_name, role, speciality, permissions, commission_type, commission_value } = req.body;

    const passCheck = validatePasswordPolicy(password, { username });

    if (!passCheck.valid) {

        return res.status(400).json({ error: passCheck.error, error_ar: passCheck.error_ar });

    }

    // ===== Batch 4D: create the user AND link it to the actor's tenant atomically (closes max_users gap). =====

    // tenantId is from the SESSION only (never the body). Linkage + insert share one transaction so the

    // entitlements count (user_tenants) reflects the new user, and a link failure rolls back (no orphan).

    const tenantId = req.session.user && req.session.user.tenantId;

    const hash = await bcrypt.hash(password, 10);

    let client;

    try {

        client = await pool.connect();

        const row = await createSystemUserWithTenantLink(client, {

            user: { username, password_hash: hash, display_name, role, speciality, permissions, commission_type, commission_value },

            tenantId

        });

        logAudit(req.session.user.id, req.session.user.display_name, 'CREATE_USER', 'Settings', `Admin created user ${username} (role=${role})` + (tenantId ? ` linked tenant#${tenantId}` : ' (no tenant context)'), req.ip);

        res.json(row);

    } catch (e) {

        console.error('POST /api/settings/users error:', e);

        res.status(500).json({ error: 'Server error' });

    } finally {

        if (client) client.release();

    }

});

router.put('/api/settings/users/:id', requireAuth, async (req, res) => {

    try {

        const actor = req.session.user;                       // identity from session only (never from body)

        const targetId = parseInt(req.params.id, 10);

        const isAdmin = actor.role === 'Admin';               // ROLE_PERMISSIONS['Admin'] = '*' (highest)

        const isSelf = actor.id === targetId;

        const { username, password, display_name, role, speciality, permissions, is_active, commission_type, commission_value } = req.body;

        const norm = v => (v === true || v === 1 || v === '1') ? 1 : (v === false || v === 0 || v === '0') ? 0 : v;



        if (password && password.trim() !== '') {

            const targetUsername = username || (await pool.query('SELECT username FROM system_users WHERE id=$1', [targetId])).rows[0]?.username;

            const passCheck = validatePasswordPolicy(password, { username: targetUsername });

            if (!passCheck.valid) {

                return res.status(400).json({ error: passCheck.error, error_ar: passCheck.error_ar });

            }

        }



        // ===== P0 GUARD: only Admin may change privileged/account-control fields; no self-escalation =====

        if (!isAdmin) {

            if (!isSelf) {

                logAudit(actor.id, actor.display_name, 'BLOCKED_USER_EDIT', 'Settings', `Non-admin attempted to edit user #${targetId}`, req.ip);

                return res.status(403).json({ error: 'Access denied' });

            }

            const cur = (await pool.query('SELECT username, role, permissions, is_active, commission_type, commission_value FROM system_users WHERE id=$1', [targetId])).rows[0];

            if (!cur) return res.status(404).json({ error: 'User not found' });

            const wantsPriv =

                (role !== undefined && String(role) !== String(cur.role)) ||

                (permissions !== undefined && String(permissions) !== String(cur.permissions || '')) ||

                (is_active !== undefined && norm(is_active) !== norm(cur.is_active)) ||

                (username !== undefined && username !== cur.username) ||

                (commission_type !== undefined && commission_type !== cur.commission_type) ||

                (commission_value !== undefined && parseFloat(commission_value) !== parseFloat(cur.commission_value));

            if (wantsPriv) {

                logAudit(actor.id, actor.display_name, 'BLOCKED_PRIVILEGE_ESCALATION', 'Settings', `Non-admin attempted to change role/permissions/status/username on own account`, req.ip);

                return res.status(403).json({ error: 'Access denied: only an administrator can change role, permissions, status, username, or commission' });

            }

            // safe self-profile update only (display_name, speciality, optional password)

            let sq = 'UPDATE system_users SET display_name=$1, speciality=$2';

            let sp = [display_name !== undefined ? display_name : actor.display_name, speciality || ''];

            let si = 3;

            if (password && password.trim() !== '') { sq += `, password_hash=$${si}`; sp.push(await bcrypt.hash(password, 10)); si++; }

            sq += ` WHERE id=$${si}`; sp.push(targetId);

            await pool.query(sq, sp);

            return res.json((await pool.query('SELECT id, username, display_name, role, speciality, permissions, commission_type, commission_value, is_active, created_at FROM system_users WHERE id=$1', [targetId])).rows[0]);

        }



        // ===== Admin path: full update, with last-active-admin protection =====

        const target = (await pool.query('SELECT role FROM system_users WHERE id=$1', [targetId])).rows[0];

        if (target && target.role === 'Admin') {

            const demoting = (role !== undefined && role !== 'Admin');

            const deactivating = (is_active !== undefined && norm(is_active) === 0);

            if (demoting || deactivating) {

                const adminCount = parseInt((await pool.query("SELECT COUNT(*) c FROM system_users WHERE role='Admin' AND is_active=1")).rows[0].c, 10);

                if (adminCount <= 1) return res.status(400).json({ error: 'Cannot demote or deactivate the last active admin' });

            }

        }

        let query = 'UPDATE system_users SET username=$1, display_name=$2, role=$3, speciality=$4, permissions=$5, is_active=$6, commission_type=$7, commission_value=$8';

        let params = [username, display_name || '', role || 'Reception', speciality || '', permissions || '', is_active === undefined ? 1 : is_active, commission_type || 'percentage', parseFloat(commission_value) || 0];

        let idx = 9;

        if (password && password.trim() !== '') {

            const hash = await bcrypt.hash(password, 10);

            query += `, password_hash=$${idx}`;

            params.push(hash);

            idx++;

        }

        query += ` WHERE id=$${idx}`;

        params.push(targetId);

        await pool.query(query, params);

        logAudit(actor.id, actor.display_name, 'UPDATE_USER', 'Settings', `Admin updated user #${targetId}` + (role !== undefined ? ` role=${role}` : ''), req.ip);

        res.json((await pool.query('SELECT id, username, display_name, role, speciality, permissions, commission_type, commission_value, is_active, created_at FROM system_users WHERE id=$1', [targetId])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.delete('/api/settings/users/:id', requireAuth, requireTenantAdmin({ action: 'BLOCKED_USER_DELETE', module: 'Settings' }), async (req, res) => {

    try {

        const userId = parseInt(req.params.id);

        if (userId === req.session.user.id) {

            console.error('DELETE USER FAILED: Cannot delete own account', { userId, actorId: req.session.user.id });

            return res.status(400).json({ error: 'Cannot delete your own account' });

        }

        const userRole = (await pool.query('SELECT role FROM system_users WHERE id=$1', [userId])).rows[0];

        if (userRole && userRole.role === 'Admin') {

            const adminCount = (await pool.query("SELECT COUNT(*) as count FROM system_users WHERE role='Admin'")).rows[0].count;

            if (parseInt(adminCount) <= 1) {

                console.error('DELETE USER FAILED: Cannot delete last admin', { adminCount });

                return res.status(400).json({ error: 'Cannot delete the last admin' });

            }

        }

        await pool.query('DELETE FROM system_users WHERE id=$1', [userId]);

        logAudit(req.session.user.id, req.session.user.display_name, 'DELETE_USER', 'Settings', `Admin deleted user #${userId}`, req.ip);

        res.json({ success: true });

    } catch (e) {

        console.error('DELETE USER ERROR:', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/settings/rooms', requireAuth, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const result = await pool.query(

            "SELECT * FROM exam_rooms WHERE tenant_id = $1 ORDER BY room_number ASC",

            [tenantId]

        );

        res.json(result.rows);

    } catch (e) {

        console.error('Error fetching rooms:', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/settings/rooms/active', requireAuth, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const result = await pool.query(

            "SELECT * FROM exam_rooms WHERE tenant_id = $1 AND status = 'Available' ORDER BY room_number ASC",

            [tenantId]

        );

        res.json(result.rows);

    } catch (e) {

        console.error('Error fetching active rooms:', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/settings/rooms', requireAuth, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { room_number, name_ar, name_en, department_id, status } = req.body;

        

        if (!room_number) {

            return res.status(400).json({ error: 'Room number is required' });

        }



        const result = await pool.query(

            `INSERT INTO exam_rooms (tenant_id, room_number, name_ar, name_en, department_id, status)

             VALUES ($1, $2, $3, $4, $5, $6)

             RETURNING *`,

            [tenantId, room_number, name_ar || '', name_en || '', department_id || null, status || 'Available']

        );

        res.status(201).json(result.rows[0]);

    } catch (e) {

        console.error('Error creating room:', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.put('/api/settings/rooms/:id', requireAuth, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { room_number, name_ar, name_en, department_id, status } = req.body;



        const result = await pool.query(

            `UPDATE exam_rooms

             SET room_number = $1, name_ar = $2, name_en = $3, department_id = $4, status = $5

             WHERE id = $6 AND tenant_id = $7

             RETURNING *`,

            [room_number, name_ar || '', name_en || '', department_id || null, status || 'Available', req.params.id, tenantId]

        );



        if (result.rows.length === 0) {

            return res.status(404).json({ error: 'Room not found' });

        }

        res.json(result.rows[0]);

    } catch (e) {

        console.error('Error updating room:', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.delete('/api/settings/rooms/:id', requireAuth, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const result = await pool.query(

            "DELETE FROM exam_rooms WHERE id = $1 AND tenant_id = $2 RETURNING *",

            [req.params.id, tenantId]

        );



        if (result.rows.length === 0) {

            return res.status(404).json({ error: 'Room not found' });

        }

        res.json({ success: true, message: 'Room deleted successfully' });

    } catch (e) {

        console.error('Error deleting room:', e);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
