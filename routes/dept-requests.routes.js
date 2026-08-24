const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeDeptRequestsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, checkAndTriggerAutoReorder, optionalReadFallback }) {
    const router = express.Router();
router.get('/api/dept-requests', requireAuth, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const query = tenantId ?

            'SELECT * FROM inventory_dept_requests WHERE tenant_id=$1 ORDER BY id DESC' :

            'SELECT * FROM inventory_dept_requests ORDER BY id DESC';

        const params = tenantId ? [tenantId] : [];

        res.json((await pool.query(query, params)).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/dept-requests', requireAuth, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const { department, requested_by, items, notes } = req.body;



        // 1. Verify items belong to the current tenant to prevent cross-tenant IDOR

        if (tenantId && items && items.length) {

            for (const item of items) {

                const itemCheck = (await pool.query('SELECT id FROM inventory_items WHERE id=$1 AND tenant_id=$2', [item.item_id || 0, tenantId])).rows[0];

                if (!itemCheck) {

                    return res.status(404).json({ error: `Item not found or access denied for item #${item.item_id}` });

                }

            }

        }



        const result = await pool.query('INSERT INTO inventory_dept_requests (department, requested_by, request_date, notes, tenant_id, branch_id) VALUES ($1,$2,CURRENT_DATE::TEXT,$3,$4,$5) RETURNING id',

            [department || '', requested_by || req.session.user?.display_name || '', notes || '', tenantId || null, facilityId || null]);

        const reqId = result.rows[0].id;



        if (items && items.length) {

            for (const item of items) {

                await pool.query('INSERT INTO inventory_dept_request_items (request_id, item_id, qty_requested, tenant_id, branch_id) VALUES ($1,$2,$3,$4,$5)',

                    [reqId, item.item_id || 0, item.qty || 1, tenantId || null, facilityId || null]);

            }

        }



        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_DEPT_REQUEST', 'Inventory', `Created department request #${reqId} for ${department}`, req.ip);



        const query = tenantId ?

            'SELECT * FROM inventory_dept_requests WHERE id=$1 AND tenant_id=$2' :

            'SELECT * FROM inventory_dept_requests WHERE id=$1';

        const params = tenantId ? [reqId, tenantId] : [reqId];

        res.json((await pool.query(query, params)).rows[0]);

    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/dept-requests/:id/items', requireAuth, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (tenantId) {

            const check = (await pool.query('SELECT id FROM inventory_dept_requests WHERE id=$1 AND tenant_id=$2', [req.params.id, tenantId])).rows[0];

            if (!check) return res.status(404).json({ error: 'Request not found' });

        }

        const query = tenantId ?

            'SELECT dri.*, ii.item_name FROM inventory_dept_request_items dri LEFT JOIN inventory_items ii ON dri.item_id=ii.id WHERE dri.request_id=$1 AND dri.tenant_id=$2' :

            'SELECT dri.*, ii.item_name FROM inventory_dept_request_items dri LEFT JOIN inventory_items ii ON dri.item_id=ii.id WHERE dri.request_id=$1';

        const params = tenantId ? [req.params.id, tenantId] : [req.params.id];

        res.json((await pool.query(query, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/dept-requests/:id', requireAuth, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (tenantId) {

            const check = (await pool.query('SELECT id FROM inventory_dept_requests WHERE id=$1 AND tenant_id=$2', [req.params.id, tenantId])).rows[0];

            if (!check) return res.status(404).json({ error: 'Request not found' });

        }



        const { status, approved_by } = req.body;

        if (status) {

            const queryUpdate = tenantId ?

                'UPDATE inventory_dept_requests SET status=$1, approved_by=$2 WHERE id=$3 AND tenant_id=$4' :

                'UPDATE inventory_dept_requests SET status=$1, approved_by=$2 WHERE id=$3';

            const paramsUpdate = tenantId ?

                [status, approved_by || req.session.user?.display_name || 'System', req.params.id, tenantId] :

                [status, approved_by || req.session.user?.display_name || 'System', req.params.id];

            await pool.query(queryUpdate, paramsUpdate);



            // If approved, deduct from inventory

            if (status === 'Approved') {

                const queryItems = tenantId ?

                    'SELECT * FROM inventory_dept_request_items WHERE request_id=$1 AND tenant_id=$2' :

                    'SELECT * FROM inventory_dept_request_items WHERE request_id=$1';

                const paramsItems = tenantId ? [req.params.id, tenantId] : [req.params.id];

                const items = (await pool.query(queryItems, paramsItems)).rows;



                for (const item of items) {

                    const approved = item.qty_approved || item.qty_requested;

                    const queryDeduct = tenantId ?

                        'UPDATE inventory_items SET stock_qty = GREATEST(stock_qty - $1, 0) WHERE id=$2 AND tenant_id=$3' :

                        'UPDATE inventory_items SET stock_qty = GREATEST(stock_qty - $1, 0) WHERE id=$2';

                    const paramsDeduct = tenantId ? [approved, item.item_id, tenantId] : [approved, item.item_id];

                    await pool.query(queryDeduct, paramsDeduct);

                    

                    // Trigger auto-reorder alert check

                    await checkAndTriggerAutoReorder(item.item_id, tenantId);

                }

            }

            logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_DEPT_REQUEST_STATUS', 'Inventory', `Updated request #${req.params.id} status to ${status}`, req.ip);

        }



        const queryFinal = tenantId ?

            'SELECT * FROM inventory_dept_requests WHERE id=$1 AND tenant_id=$2' :

            'SELECT * FROM inventory_dept_requests WHERE id=$1';

        const paramsFinal = tenantId ? [req.params.id, tenantId] : [req.params.id];

        res.json((await pool.query(queryFinal, paramsFinal)).rows[0]);

    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
