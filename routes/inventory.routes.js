const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeInventoryRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, checkAndTriggerAutoReorder, e16, e16BeginTenantTx, e16RequireTenant, optionalReadFallback }) {
    const router = express.Router();
router.get('/api/inventory/items', requireAuth, requireRole('inventory', 'pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const query = tenantId ?

            'SELECT * FROM inventory_items WHERE is_active=1 AND tenant_id=$1 ORDER BY item_name' :

            'SELECT * FROM inventory_items WHERE is_active=1 ORDER BY item_name';

        const params = tenantId ? [tenantId] : [];

        res.json((await pool.query(query, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/inventory/items', requireAuth, requireRole('inventory', 'pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const { item_name, item_code, category, unit, cost_price, stock_qty } = req.body;

        const result = await pool.query('INSERT INTO inventory_items (item_name, item_code, category, unit, cost_price, stock_qty, tenant_id, branch_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',

            [item_name, item_code || '', category || '', unit || '', cost_price || 0, stock_qty || 0, tenantId || null, facilityId || null]);



        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_INVENTORY_ITEM_DETAIL', 'Inventory', `Created item details for ${item_name} with qty ${stock_qty}`, req.ip);



        const query = tenantId ?

            'SELECT * FROM inventory_items WHERE id=$1 AND tenant_id=$2' :

            'SELECT * FROM inventory_items WHERE id=$1';

        const params = tenantId ? [result.rows[0].id, tenantId] : [result.rows[0].id];

        res.json((await pool.query(query, params)).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/inventory/low-stock', requireAuth, requireTenantScope, async (req, res) => {

    try {

        // inventory.tenant_id provisioned out-of-band (route_level_ddl_batch_b); no DDL in handler

        // inventory.facility_id provisioned out-of-band (route_level_ddl_batch_b); no DDL in handler

        const { tenantId } = getRequestTenantContext(req);

        const query = tenantId ?

            "SELECT * FROM inventory WHERE tenant_id=$1 AND CAST(quantity AS INTEGER) <= CAST(COALESCE(reorder_level,'10') AS INTEGER) ORDER BY CAST(quantity AS INTEGER) ASC" :

            "SELECT * FROM inventory WHERE CAST(quantity AS INTEGER) <= CAST(COALESCE(reorder_level,'10') AS INTEGER) ORDER BY CAST(quantity AS INTEGER) ASC";

        const params = tenantId ? [tenantId] : [];

        const items = (await pool.query(query, params)).rows;

        res.json(items);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/inventory', requireAuth, requireTenantScope, async (req, res) => {

    try {

        // inventory schema provisioned out-of-band (route_level_ddl_batch_b); no DDL in handler

        // inventory.tenant_id provisioned out-of-band (route_level_ddl_batch_b); no DDL in handler

        // inventory.facility_id provisioned out-of-band (route_level_ddl_batch_b); no DDL in handler



        const { tenantId } = getRequestTenantContext(req);

        const query = tenantId ?

            'SELECT * FROM inventory WHERE tenant_id=$1 ORDER BY name ASC' :

            'SELECT * FROM inventory ORDER BY name ASC';

        const params = tenantId ? [tenantId] : [];

        res.json((await pool.query(query, params)).rows);

    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/inventory', requireAuth, requireTenantScope, async (req, res) => {

    try {

        // inventory.tenant_id provisioned out-of-band (route_level_ddl_batch_b); no DDL in handler

        // inventory.facility_id provisioned out-of-band (route_level_ddl_batch_b); no DDL in handler



        const { tenantId, facilityId } = getRequestTenantContext(req);

        const { name, category, quantity, unit, reorder_level, location, supplier, cost, expiry_date } = req.body;

        const r = await pool.query('INSERT INTO inventory (name,category,quantity,unit,reorder_level,location,supplier,cost,expiry_date,tenant_id,facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',

            [name, category, quantity || 0, unit, reorder_level || 10, location, supplier, cost, expiry_date, tenantId || null, facilityId || null]);



        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_INVENTORY_ITEM', 'Inventory', `Created item ${name} with initial stock ${quantity}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/inventory/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        // inventory.tenant_id provisioned out-of-band (route_level_ddl_batch_b); no DDL in handler

        const { tenantId } = getRequestTenantContext(req);

        if (tenantId) {

            const check = (await pool.query('SELECT id FROM inventory WHERE id=$1 AND tenant_id=$2', [req.params.id, tenantId])).rows[0];

            if (!check) return res.status(404).json({ error: 'Item not found' });

        }

        const { name, category, quantity, unit, reorder_level, location, supplier, cost, expiry_date } = req.body;

        const query = tenantId ?

            'UPDATE inventory SET name=$1,category=$2,quantity=$3,unit=$4,reorder_level=$5,location=$6,supplier=$7,cost=$8,expiry_date=$9 WHERE id=$10 AND tenant_id=$11 RETURNING *' :

            'UPDATE inventory SET name=$1,category=$2,quantity=$3,unit=$4,reorder_level=$5,location=$6,supplier=$7,cost=$8,expiry_date=$9 WHERE id=$10 RETURNING *';

        const params = tenantId ?

            [name, category, quantity, unit, reorder_level, location, supplier, cost, expiry_date, req.params.id, tenantId] :

            [name, category, quantity, unit, reorder_level, location, supplier, cost, expiry_date, req.params.id];

        const r = await pool.query(query, params);



        logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_INVENTORY_ITEM', 'Inventory', `Updated item #${req.params.id} (${name})`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.delete('/api/inventory/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        // inventory.tenant_id provisioned out-of-band (route_level_ddl_batch_b); no DDL in handler

        const { tenantId } = getRequestTenantContext(req);

        if (tenantId) {

            const check = (await pool.query('SELECT id FROM inventory WHERE id=$1 AND tenant_id=$2', [req.params.id, tenantId])).rows[0];

            if (!check) return res.status(404).json({ error: 'Item not found' });

        }

        const query = tenantId ? 'DELETE FROM inventory WHERE id=$1 AND tenant_id=$2' : 'DELETE FROM inventory WHERE id=$1';

        const params = tenantId ? [req.params.id, tenantId] : [req.params.id];

        await pool.query(query, params);



        logAudit(req.session.user?.id, req.session.user?.display_name, 'DELETE_INVENTORY_ITEM', 'Inventory', `Deleted item #${req.params.id}`, req.ip);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/inventory/items/low-stock', requireAuth, requireRole('inventory', 'pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const rows = (await pool.query(

            'SELECT id, item_name, item_code, stock_qty, min_qty FROM inventory_items WHERE is_active=1 AND tenant_id=$1 ORDER BY stock_qty ASC',

            [t.tenantId])).rows;

        const out = rows.map(r => {

            const rp = r.min_qty;

            return { ...r, stock_status: e16.stockStatus(r.stock_qty, rp), is_low: e16.isLowStock(r.stock_qty, rp) };

        }).filter(r => r.is_low);

        res.json(out);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/inventory/batches', requireAuth, requireRole('inventory', 'pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const itemId = e16.e16IntId(req.query.item_id);

        const params = [t.tenantId];

        let q = 'SELECT * FROM inventory_batches WHERE tenant_id=$1';

        if (itemId) { q += ' AND item_id=$2'; params.push(itemId); }

        q += ' ORDER BY expiry_date ASC NULLS LAST, id ASC';

        res.json((await pool.query(q, params)).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/inventory/purchase-orders', requireAuth, requireRole('inventory', 'pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const { po_number, supplier_id, supplier_name, notes, items } = req.body;

        if (!Array.isArray(items) || items.length === 0) return res.status(422).json({ error: 'PO must have at least one line item' });

        // validate every line: integer item id owned by tenant, positive qty.

        const lines = [];

        for (const it of items) {

            const iid = e16.e16IntId(it.item_id);

            const qty = e16.e16Qty(it.qty_ordered);

            if (iid === null || qty === null || qty <= 0) return res.status(422).json({ error: 'Invalid PO line' });

            const own = (await pool.query('SELECT id FROM inventory_items WHERE id=$1 AND tenant_id=$2', [iid, t.tenantId])).rows[0];

            if (!own) return res.status(404).json({ error: 'Item not found' });

            lines.push({ iid, qty, unit_cost: e16.e16Qty(it.unit_cost) || 0 });

        }

        const total = lines.reduce((s, l) => s + l.qty * l.unit_cost, 0);

        const client = await e16BeginTenantTx(t.tenantId);

        try {

            const po = (await client.query(

                'INSERT INTO purchase_orders (po_number, supplier_id, supplier_name, status, total_amount, notes, created_by, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',

                [po_number || '', e16.e16IntId(supplier_id), supplier_name || '', 'draft', total, notes || '', req.session.user?.display_name || '', t.tenantId, t.facilityId || null])).rows[0];

            for (const l of lines) {

                await client.query(

                    'INSERT INTO purchase_order_items (po_id, item_id, qty_ordered, unit_cost, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6)',

                    [po.id, l.iid, l.qty, l.unit_cost, t.tenantId, t.facilityId || null]);

            }

            await client.query('COMMIT');

            client.release();

            logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_PURCHASE_ORDER', 'Inventory', `Created PO #${po.id} (${lines.length} lines, total ${total})`, req.ip);

            res.json(po);

        } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); throw e; }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/inventory/purchase-orders/:id/status', requireAuth, requireRole('inventory', 'pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const poId = e16.e16IntId(req.params.id);

        if (poId === null) return res.status(404).json({ error: 'PO not found' });

        const target = String(req.body.status || '');

        const client = await e16BeginTenantTx(t.tenantId);

        try {

            const po = (await client.query('SELECT id, status FROM purchase_orders WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [poId, t.tenantId])).rows[0];

            if (!po) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'PO not found' }); }

            if (!e16.canTransitionPO(po.status, target)) {

                await client.query('ROLLBACK'); client.release();

                return res.status(409).json({ error: `Invalid PO transition ${po.status} -> ${target}` });

            }

            const approving = target === 'approved';

            const r = (await client.query(

                'UPDATE purchase_orders SET status=$1, approved_by=COALESCE($2,approved_by), approved_at=COALESCE($3,approved_at) WHERE id=$4 AND tenant_id=$5 RETURNING *',

                [target, approving ? (req.session.user?.display_name || '') : null, approving ? new Date().toISOString() : null, poId, t.tenantId])).rows[0];

            await client.query('COMMIT'); client.release();

            logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_PO_STATUS', 'Inventory', `PO #${poId}: ${po.status} -> ${target}`, req.ip);

            res.json(r);

        } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); throw e; }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/inventory/goods-receipts', requireAuth, requireRole('inventory', 'pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const poId = e16.e16IntId(req.body.po_id);

        if (poId === null) return res.status(404).json({ error: 'PO not found' });

        const { grn_number, notes, lines } = req.body;

        if (!Array.isArray(lines) || lines.length === 0) return res.status(422).json({ error: 'GRN must have at least one line' });



        const client = await e16BeginTenantTx(t.tenantId);

        try {

            // lock PO header first (ascending lock order: header before items)

            const po = (await client.query('SELECT id, status FROM purchase_orders WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [poId, t.tenantId])).rows[0];

            if (!po) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'PO not found' }); }

            if (!e16.canReceivePO(po.status)) {

                await client.query('ROLLBACK'); client.release();

                return res.status(409).json({ error: `PO not receivable in status ${po.status}` });

            }

            // validate + lock each PO line (ascending id) before mutating

            const validated = [];

            const poItemIds = lines.map(l => e16.e16IntId(l.po_item_id)).filter(x => x !== null).sort((a, b) => a - b);

            if (poItemIds.length === 0) { await client.query('ROLLBACK'); client.release(); return res.status(422).json({ error: 'No valid PO items to receive' }); }

            for (const pid of poItemIds) {

                const line = lines.find(l => e16.e16IntId(l.po_item_id) === pid);

                const qty = e16.e16Qty(line.qty_received);

                if (qty === null || qty <= 0) { await client.query('ROLLBACK'); client.release(); return res.status(422).json({ error: 'Invalid GRN qty' }); }

                const poItem = (await client.query('SELECT id, item_id, qty_ordered, qty_received FROM purchase_order_items WHERE id=$1 AND po_id=$2 AND tenant_id=$3 FOR UPDATE', [pid, poId, t.tenantId])).rows[0];

                if (!poItem) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'PO line not found' }); }

                const remaining = poItem.qty_ordered - poItem.qty_received;

                if (qty > remaining) { await client.query('ROLLBACK'); client.release(); return res.status(409).json({ error: `Over-receipt: line ${pid} remaining ${remaining}, got ${qty}` }); }

                validated.push({ poItem, qty, lot_number: line.lot_number || '', expiry_date: line.expiry_date || null, unit_cost: e16.e16Qty(line.unit_cost) || 0 });

            }



            const grn = (await client.query(

                'INSERT INTO goods_receipts (grn_number, po_id, received_by, notes, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',

                [grn_number || '', poId, req.session.user?.display_name || '', notes || '', t.tenantId, t.facilityId || null])).rows[0];



            for (const v of validated) {

                // 1. create batch (qty_received = qty_on_hand at receipt)

                const batch = (await client.query(

                    'INSERT INTO inventory_batches (item_id, lot_number, expiry_date, qty_received, qty_on_hand, unit_cost, status, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$4,$5,$6,$7,$8) RETURNING id',

                    [v.poItem.item_id, v.lot_number, v.expiry_date, v.qty, v.unit_cost, 'active', t.tenantId, t.facilityId || null])).rows[0];

                // 2. bump the item master stock_qty (server-authoritative)

                const upd = (await client.query(

                    'UPDATE inventory_items SET stock_qty = stock_qty + $1, updated_at=now() WHERE id=$2 AND tenant_id=$3 RETURNING stock_qty',

                    [v.qty, v.poItem.item_id, t.tenantId])).rows[0];

                // 3. ledger movement (receive, +qty)

                await client.query(

                    'INSERT INTO inventory_movements (item_id, batch_id, movement_type, qty_delta, balance_after, ref_table, ref_id, reason, created_by, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',

                    [v.poItem.item_id, batch.id, 'receive', v.qty, upd ? upd.stock_qty : null, 'goods_receipts', grn.id, 'GRN', req.session.user?.display_name || '', t.tenantId, t.facilityId || null]);

                // 4. GRN line + PO line received bump

                await client.query(

                    'INSERT INTO goods_receipt_items (grn_id, po_item_id, item_id, batch_id, qty_received, lot_number, expiry_date, unit_cost, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',

                    [grn.id, v.poItem.id, v.poItem.item_id, batch.id, v.qty, v.lot_number, v.expiry_date, v.unit_cost, t.tenantId, t.facilityId || null]);

                await client.query('UPDATE purchase_order_items SET qty_received = qty_received + $1 WHERE id=$2 AND tenant_id=$3', [v.qty, v.poItem.id, t.tenantId]);

            }



            // recompute PO header status from line fulfilment (server-authoritative)

            const agg = (await client.query('SELECT COALESCE(SUM(qty_ordered),0) AS ord, COALESCE(SUM(qty_received),0) AS rec FROM purchase_order_items WHERE po_id=$1 AND tenant_id=$2', [poId, t.tenantId])).rows[0];

            const newStatus = (Number(agg.rec) >= Number(agg.ord)) ? 'received' : 'partially_received';

            await client.query('UPDATE purchase_orders SET status=$1 WHERE id=$2 AND tenant_id=$3', [newStatus, poId, t.tenantId]);



            await client.query('COMMIT'); client.release();

            logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_GOODS_RECEIPT', 'Inventory', `GRN #${grn.id} against PO #${poId}; PO now ${newStatus}`, req.ip);

            res.json({ ...grn, po_status: newStatus });

        } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); throw e; }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/inventory/movements', requireAuth, requireRole('inventory', 'pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const itemId = e16.e16IntId(req.body.item_id);

        const qty = e16.e16Qty(req.body.qty);

        const movementType = String(req.body.movement_type || '');

        if (itemId === null || qty === null || qty <= 0) return res.status(422).json({ error: 'Invalid item or quantity' });

        const sign = e16.movementSign(movementType);

        if (sign === null) return res.status(422).json({ error: 'Invalid movement_type' });



        const client = await e16BeginTenantTx(t.tenantId);

        try {

            const item = (await client.query('SELECT id, stock_qty FROM inventory_items WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [itemId, t.tenantId])).rows[0];

            if (!item) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Item not found' }); }



            if (sign < 0) {

                // DECREMENT path: never allow negative. Allocate FEFO across active batches (locked ascending id).

                const dec = e16.checkDecrement(item.stock_qty, qty);

                if (!dec.ok) { await client.query('ROLLBACK'); client.release(); return res.status(409).json({ error: 'Insufficient stock', detail: dec }); }

                const batches = (await client.query(

                    'SELECT id, qty_on_hand, expiry_date FROM inventory_batches WHERE item_id=$1 AND tenant_id=$2 AND qty_on_hand > 0 ORDER BY id ASC FOR UPDATE',

                    [itemId, t.tenantId])).rows;

                const alloc = e16.fefoAllocate(batches, qty);

                if (!alloc.ok) { await client.query('ROLLBACK'); client.release(); return res.status(409).json({ error: 'Insufficient batch stock', detail: alloc }); }

                // apply allocations in ascending batch id order (deadlock-safe)

                const ordered = [...alloc.allocations].sort((a, b) => a.batch_id - b.batch_id);

                for (const a of ordered) {

                    const ur = await client.query(

                        'UPDATE inventory_batches SET qty_on_hand = qty_on_hand - $1 WHERE id=$2 AND tenant_id=$3 AND qty_on_hand >= $1 RETURNING qty_on_hand',

                        [a.qty, a.batch_id, t.tenantId]);

                    if (ur.rowCount === 0) { await client.query('ROLLBACK'); client.release(); return res.status(409).json({ error: 'Batch race / insufficient batch stock' }); }

                }

                const newQty = (await client.query(

                    'UPDATE inventory_items SET stock_qty = stock_qty - $1, updated_at=now() WHERE id=$2 AND tenant_id=$3 AND stock_qty >= $1 RETURNING stock_qty',

                    [qty, itemId, t.tenantId]));

                if (newQty.rowCount === 0) { await client.query('ROLLBACK'); client.release(); return res.status(409).json({ error: 'Insufficient stock' }); }

                await client.query(

                    'INSERT INTO inventory_movements (item_id, batch_id, movement_type, qty_delta, balance_after, ref_table, ref_id, reason, created_by, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',

                    [itemId, ordered[0] ? ordered[0].batch_id : null, movementType, -qty, newQty.rows[0].stock_qty, String(req.body.ref_table || ''), e16.e16IntId(req.body.ref_id), String(req.body.reason || ''), req.session.user?.display_name || '', t.tenantId, t.facilityId || null]);

                await client.query('COMMIT'); client.release();



                // Trigger auto-reorder alert check

                await checkAndTriggerAutoReorder(itemId, t.tenantId);



                logAudit(req.session.user?.id, req.session.user?.display_name, 'STOCK_MOVEMENT', 'Inventory', `${movementType} -${qty} item #${itemId}; FEFO over ${ordered.length} batch(es)`, req.ip);

                return res.json({ success: true, balance_after: newQty.rows[0].stock_qty, allocations: ordered });

            } else {

                // INCREMENT path (adjust_in / transfer_in): bump master; optional batch.

                const batchId = e16.e16IntId(req.body.batch_id);

                if (batchId) {

                    const br = await client.query('UPDATE inventory_batches SET qty_on_hand = qty_on_hand + $1 WHERE id=$2 AND tenant_id=$3 RETURNING id', [qty, batchId, t.tenantId]);

                    if (br.rowCount === 0) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Batch not found' }); }

                }

                const newQty = (await client.query('UPDATE inventory_items SET stock_qty = stock_qty + $1, updated_at=now() WHERE id=$2 AND tenant_id=$3 RETURNING stock_qty', [qty, itemId, t.tenantId])).rows[0];

                await client.query(

                    'INSERT INTO inventory_movements (item_id, batch_id, movement_type, qty_delta, balance_after, ref_table, ref_id, reason, created_by, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',

                    [itemId, batchId, movementType, qty, newQty.stock_qty, String(req.body.ref_table || ''), e16.e16IntId(req.body.ref_id), String(req.body.reason || ''), req.session.user?.display_name || '', t.tenantId, t.facilityId || null]);

                await client.query('COMMIT'); client.release();

                logAudit(req.session.user?.id, req.session.user?.display_name, 'STOCK_MOVEMENT', 'Inventory', `${movementType} +${qty} item #${itemId}`, req.ip);

                return res.json({ success: true, balance_after: newQty.stock_qty });

            }

        } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); throw e; }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/inventory/movements', requireAuth, requireRole('inventory', 'pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const itemId = e16.e16IntId(req.query.item_id);

        const params = [t.tenantId];

        let q = 'SELECT * FROM inventory_movements WHERE tenant_id=$1';

        if (itemId) { q += ' AND item_id=$2'; params.push(itemId); }

        q += ' ORDER BY created_at DESC, id DESC LIMIT 500';

        res.json((await pool.query(q, params)).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/inventory/stock-counts', requireAuth, requireRole('inventory', 'pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const t = e16RequireTenant(req);

        if (!t.ok) return res.status(403).json({ error: 'Tenant scope required' });

        const itemId = e16.e16IntId(req.body.item_id);

        const counted = e16.e16Qty(req.body.counted_qty);

        if (itemId === null || counted === null || counted < 0) return res.status(422).json({ error: 'Invalid item or counted_qty' });

        const client = await e16BeginTenantTx(t.tenantId);

        try {

            const item = (await client.query('SELECT id, stock_qty FROM inventory_items WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [itemId, t.tenantId])).rows[0];

            if (!item) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Item not found' }); }

            const systemQty = item.stock_qty;

            const diff = counted - systemQty;     // server computes variance (not client-trusted)

            const reconcile = req.body.reconcile === true || req.body.reconcile === 'true';

            const sc = (await client.query(

                'INSERT INTO inventory_stock_counts (item_id, system_qty, counted_qty, difference, reconciled, counted_by, notes, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',

                [itemId, systemQty, counted, diff, reconcile ? 1 : 0, req.session.user?.display_name || '', String(req.body.notes || ''), t.tenantId, t.facilityId || null])).rows[0];

            if (reconcile && diff !== 0) {

                const mtype = diff > 0 ? 'adjust_in' : 'adjust_out';

                const newQty = (await client.query('UPDATE inventory_items SET stock_qty=$1, updated_at=now() WHERE id=$2 AND tenant_id=$3 RETURNING stock_qty', [counted, itemId, t.tenantId])).rows[0];

                await client.query(

                    'INSERT INTO inventory_movements (item_id, movement_type, qty_delta, balance_after, ref_table, ref_id, reason, created_by, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',

                    [itemId, mtype, diff, newQty.stock_qty, 'inventory_stock_counts', sc.id, 'reconciliation', req.session.user?.display_name || '', t.tenantId, t.facilityId || null]);

            }

            await client.query('COMMIT'); client.release();



            // Trigger auto-reorder alert check

            await checkAndTriggerAutoReorder(itemId, t.tenantId);



            logAudit(req.session.user?.id, req.session.user?.display_name, 'STOCK_COUNT', 'Inventory', `Count item #${itemId}: sys ${systemQty} vs counted ${counted} (diff ${diff})${reconcile ? ' reconciled' : ''}`, req.ip);

            res.json(sc);

        } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} client.release(); throw e; }

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
