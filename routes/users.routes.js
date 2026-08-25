const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeUsersRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, ce, upload }) {
    const router = express.Router();
router.get('/api/users', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (tenantId) {

            const scoped = await pool.query(

                `SELECT su.id, su.username, su.display_name, su.role, su.speciality

                   FROM system_users su

                   JOIN user_tenants ut ON ut.user_id = su.id

                  WHERE ut.tenant_id = $1 AND ut.is_active = true AND su.is_active = 1

                  ORDER BY su.display_name, su.username`,

                [tenantId]

            ).catch(async (e) => {

                if (e.code !== '42P01' && e.code !== '42703') throw e;

                return pool.query(

                    `SELECT id, username, display_name, role, speciality

                       FROM system_users

                      WHERE is_active = 1

                      ORDER BY display_name, username`

                );

            });

            return res.json(scoped.rows);

        }

        const rows = await pool.query(

            `SELECT id, username, display_name, role, speciality

               FROM system_users

              WHERE is_active = 1

              ORDER BY display_name, username`

        );

        res.json(rows.rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
