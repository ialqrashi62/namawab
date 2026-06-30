/**
 * user_provisioning.js — Jumanasoft atomic system-user creation with tenant linkage (Batch 4D).
 *
 * Closes the max_users count gap: a tenant user created via POST /api/settings/users is linked into
 * user_tenants in the SAME transaction as the system_users insert, so entitlements.countTenantUsers
 * (which reads user_tenants) reflects it. No orphan: a link failure rolls back the whole creation.
 *
 * Security: tenantId is supplied by the CALLER from the session (never the request body). app.tenant_id
 * is bound (transaction-local) for the RLS-protected user_tenants insert. Duplicate link is a no-op
 * (ON CONFLICT (user_id, tenant_id) DO NOTHING via uq_user_tenant).
 *
 * The caller owns the client lifecycle (pool.connect / client.release).
 */
'use strict';

const SELECT_USER_COLS = 'id, username, display_name, role, speciality, permissions, commission_type, commission_value, is_active, created_at';

/**
 * createSystemUserWithTenantLink(client, opts) -> created user row.
 * opts: { user: {username,password_hash,display_name,role,speciality,permissions,commission_type,commission_value}, tenantId }
 * Runs BEGIN..COMMIT; throws (after ROLLBACK) on any failure so no partial/orphan row remains.
 */
async function createSystemUserWithTenantLink(client, opts = {}) {
    const u = opts.user || {};
    const tenantId = opts.tenantId;
    await client.query('BEGIN');
    try {
        // bind tenant context for the RLS-protected user_tenants insert (transaction-local)
        if (tenantId) await client.query("SELECT set_config('app.tenant_id', $1, true)", [String(tenantId)]);
        const ins = await client.query(
            'INSERT INTO system_users (username, password_hash, display_name, role, speciality, permissions, commission_type, commission_value) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
            [u.username, u.password_hash, u.display_name || '', u.role || 'Reception', u.speciality || '', u.permissions || '', u.commission_type || 'percentage', parseFloat(u.commission_value) || 0]
        );
        const newId = ins.rows[0].id;
        // link to the actor's tenant (idempotent). tenantId is from the session, NEVER the request body.
        if (tenantId) {
            await client.query(
                'INSERT INTO user_tenants (user_id, tenant_id, is_active) VALUES ($1,$2,true) ON CONFLICT (user_id, tenant_id) DO NOTHING',
                [newId, tenantId]
            );
        }
        const row = (await client.query('SELECT ' + SELECT_USER_COLS + ' FROM system_users WHERE id=$1', [newId])).rows[0];
        await client.query('COMMIT');
        return row;
    } catch (e) {
        try { await client.query('ROLLBACK'); } catch (_) { /* best-effort */ }
        throw e;
    }
}

module.exports = { createSystemUserWithTenantLink, SELECT_USER_COLS };
