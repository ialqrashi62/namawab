const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeSurgeryPreopTestsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.put('/api/surgery-preop-tests/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);



        // Verify test ownership first

        const checkQ = tenantId

            ? 'SELECT id FROM surgery_preop_tests WHERE id = $1 AND tenant_id = $2'

            : 'SELECT id FROM surgery_preop_tests WHERE id = $1';

        const checkParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const testCheck = (await pool.query(checkQ, checkParams)).rows[0];

        if (!testCheck) return res.status(404).json({ error: 'Pre-op test not found' });



        const { is_completed, result_summary } = req.body;

        if (is_completed !== undefined) {

            const updateQ = tenantId

                ? 'UPDATE surgery_preop_tests SET is_completed=$1 WHERE id=$2 AND tenant_id=$3'

                : 'UPDATE surgery_preop_tests SET is_completed=$1 WHERE id=$2';

            const updateParams = tenantId ? [is_completed ? 1 : 0, req.params.id, tenantId] : [is_completed ? 1 : 0, req.params.id];

            await pool.query(updateQ, updateParams);

        }

        if (result_summary !== undefined) {

            const updateQ = tenantId

                ? 'UPDATE surgery_preop_tests SET result_summary=$1 WHERE id=$2 AND tenant_id=$3'

                : 'UPDATE surgery_preop_tests SET result_summary=$1 WHERE id=$2';

            const updateParams = tenantId ? [result_summary, req.params.id, tenantId] : [result_summary, req.params.id];

            await pool.query(updateQ, updateParams);

        }



        const returnQ = tenantId

            ? 'SELECT * FROM surgery_preop_tests WHERE id=$1 AND tenant_id=$2'

            : 'SELECT * FROM surgery_preop_tests WHERE id=$1';

        const returnParams = tenantId ? [req.params.id, tenantId] : [req.params.id];



        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'UPDATE_PREOP_TEST', 'Surgery', `Updated preop test result ${req.params.id}`, req.ip);

        res.json((await pool.query(returnQ, returnParams)).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
