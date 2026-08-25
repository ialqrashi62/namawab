const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makePharmacyRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, cds, getPatientActiveMeds, withPharmacyTx, optionalReadFallback }) {
    const router = express.Router();
router.get('/api/pharmacy/drugs', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const query = tenantId ?

            'SELECT * FROM pharmacy_drug_catalog WHERE is_active=1 AND tenant_id=$1 ORDER BY drug_name' :

            'SELECT * FROM pharmacy_drug_catalog WHERE is_active=1 ORDER BY drug_name';

        const params = tenantId ? [tenantId] : [];

        res.json((await pool.query(query, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/pharmacy/low-stock', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const query = tenantId ?

            'SELECT * FROM pharmacy_drug_catalog WHERE is_active=1 AND stock_qty <= COALESCE(min_qty, 10) AND tenant_id=$1 ORDER BY stock_qty ASC' :

            'SELECT * FROM pharmacy_drug_catalog WHERE is_active=1 AND stock_qty <= COALESCE(min_qty, 10) ORDER BY stock_qty ASC';

        const params = tenantId ? [tenantId] : [];

        const lowStock = (await pool.query(query, params)).rows;

        res.json(lowStock);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/pharmacy/drugs', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { drug_name, active_ingredient, category, unit, selling_price, cost_price, stock_qty } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const result = await pool.query('INSERT INTO pharmacy_drug_catalog (drug_name, active_ingredient, category, unit, selling_price, cost_price, stock_qty, tenant_id, branch_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id',

            [drug_name, active_ingredient || '', category || '', unit || '', selling_price || 0, cost_price || 0, stock_qty || 0, tenantId || null, facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ADD_DRUG', 'Pharmacy',

            `Added drug ${drug_name} to catalog`, req.ip);

        const selectQuery = tenantId ?

            'SELECT * FROM pharmacy_drug_catalog WHERE id=$1 AND tenant_id=$2' :

            'SELECT * FROM pharmacy_drug_catalog WHERE id=$1';

        const selectParams = tenantId ? [result.rows[0].id, tenantId] : [result.rows[0].id];

        res.json((await pool.query(selectQuery, selectParams)).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/pharmacy/drugs', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const q = req.query.q || '';

        let rows;

        if (q) {

            rows = (await pool.query(

                `SELECT * FROM pharmacy_drugs WHERE (tenant_id=$1 OR tenant_id IS NULL)

                 AND (name_ar ILIKE $2 OR name_en ILIKE $2 OR generic_name ILIKE $2)

                 ORDER BY name_ar ASC LIMIT 50`,

                [tenantId, `%${q}%`]

            )).rows;

        } else {

            rows = (await pool.query(

                `SELECT * FROM pharmacy_drugs WHERE (tenant_id=$1 OR tenant_id IS NULL) ORDER BY name_ar ASC LIMIT 500`,

                [tenantId]

            )).rows;

        }

        res.json(rows);

    } catch (e) {

        // Table might differ — try alternate name

        try {

            const { tenantId } = getRequestTenantContext(req);

            const rows = (await pool.query('SELECT id, name_ar, name_en, generic_name, price FROM drugs WHERE tenant_id=$1 OR tenant_id IS NULL ORDER BY name_ar ASC LIMIT 500', [tenantId])).rows;

            res.json(rows);

        } catch { res.json([]); }

    }

});

router.get('/api/pharmacy/queue', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const query = tenantId ?

            `SELECT q.*, p.name_ar as patient_name, p.file_number, p.phone, p.age, p.department, q.doctor

             FROM pharmacy_prescriptions_queue q

             LEFT JOIN patients p ON q.patient_id = p.id

             WHERE q.tenant_id=$1

             ORDER BY q.id DESC` :

            `SELECT q.*, p.name_ar as patient_name, p.file_number, p.phone, p.age, p.department, q.doctor

             FROM pharmacy_prescriptions_queue q

             LEFT JOIN patients p ON q.patient_id = p.id

             ORDER BY q.id DESC`;

        const params = tenantId ? [tenantId] : [];

        const rows = (await pool.query(query, params)).rows;

        res.json(rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/pharmacy/queue/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { status, price, payment_method, patient_id } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const checkParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const rxCheck = (await pool.query(`SELECT id FROM pharmacy_prescriptions_queue WHERE id=$1${tenantCheck}`, checkParams)).rows[0];

        if (!rxCheck) return res.status(404).json({ error: 'Queue item not found' });



        if (tenantId && patient_id) {

            const patientCheck = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

            if (!patientCheck) return res.status(404).json({ error: 'Patient not found' });

        }



        // Ensure columns exist

        // pharmacy_prescriptions_queue price/payment_method columns provisioned out-of-band (route_level_ddl_batch_c); no DDL in handler

        const updateQuery = tenantId ?

            `UPDATE pharmacy_prescriptions_queue SET status=$1, dispensed_by=$2, dispensed_at=CURRENT_TIMESTAMP, price=$3, payment_method=$4 WHERE id=$5 AND tenant_id=$6` :

            `UPDATE pharmacy_prescriptions_queue SET status=$1, dispensed_by=$2, dispensed_at=CURRENT_TIMESTAMP, price=$3, payment_method=$4 WHERE id=$5`;

        const updateParams = tenantId ?

            [status || 'Dispensed', req.session.user?.display_name || '', price || 0, payment_method || 'Cash', req.params.id, tenantId] :

            [status || 'Dispensed', req.session.user?.display_name || '', price || 0, payment_method || 'Cash', req.params.id];

        await pool.query(updateQuery, updateParams);



        // Create invoice if price > 0

        if (price && price > 0 && patient_id) {

            const rxQuery = tenantId ?

                'SELECT * FROM pharmacy_prescriptions_queue WHERE id=$1 AND tenant_id=$2' :

                'SELECT * FROM pharmacy_prescriptions_queue WHERE id=$1';

            const rxParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

            const rx = (await pool.query(rxQuery, rxParams)).rows[0];



            const patientQuery = tenantId ?

                'SELECT name_ar, name_en, nationality FROM patients WHERE id=$1 AND tenant_id=$2' :

                'SELECT name_ar, name_en, nationality FROM patients WHERE id=$1';

            const patientParams = tenantId ? [patient_id, tenantId] : [patient_id];

            const patient = (await pool.query(patientQuery, patientParams)).rows[0];



            const vat = await calcVAT(patient_id);

            const { total: finalTotal, vatAmount } = addVAT(price, vat.rate);

            await pool.query(

                `INSERT INTO invoices (patient_id, patient_name, total, amount, vat_amount, description, service_type, paid, payment_method, tenant_id, facility_id)

                 VALUES ($1, $2, $3, $4, $5, $6, 'Pharmacy', 1, $7, $8, $9)`,

                [patient_id, patient?.name_ar || patient?.name_en || '', finalTotal, price, vatAmount,

                    `Pharmacy: ${rx?.prescription_text || ''}`, payment_method || 'Cash', tenantId || null, facilityId || null]

            );

        }

        logAudit(req.session.user?.id, req.session.user?.display_name, 'DISPENSE_MEDICATION', 'Pharmacy',

            `Dispensed queue item #${req.params.id} status:${status} price:${price}`, req.ip);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/pharmacy/drugs', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const query = tenantId ?

            'SELECT * FROM pharmacy_drug_catalog WHERE tenant_id=$1 ORDER BY drug_name' :

            'SELECT * FROM pharmacy_drug_catalog ORDER BY drug_name';

        const params = tenantId ? [tenantId] : [];

        const rows = (await pool.query(query, params)).rows;

        res.json(rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/pharmacy/drugs', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { drug_name, selling_price, stock_qty, category, active_ingredient } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const r = await pool.query(

            `INSERT INTO pharmacy_drug_catalog (drug_name, selling_price, stock_qty, category, active_ingredient, tenant_id, branch_id)

             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,

            [drug_name || '', selling_price || 0, stock_qty || 0, category || '', active_ingredient || '', tenantId || null, facilityId || null]

        );

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ADD_DRUG', 'Pharmacy',

            `Added drug ${drug_name} to catalog`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/pharmacy/batches', requireAuth, requireRole('pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const days = Math.max(1, parseInt(req.query.days, 10) || 90);

        // Explicit tenant_id predicate (defense-in-depth) + FORCE RLS. Null tenant blocked upstream.

        const rows = (await pool.query(

            `SELECT b.*, (b.expiry_date < CURRENT_DATE) AS is_expired,

                    (b.expiry_date < CURRENT_DATE + ($2::int * INTERVAL '1 day')) AS is_near_expiry

             FROM drug_batches b

             WHERE b.tenant_id=$1

             ORDER BY b.drug_id, b.expiry_date ASC`,

            [tenantId, days])).rows;

        res.json(rows);

    } catch (e) {

        if (e.code === '42P01' || e.code === '42703') return res.json([]);

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/pharmacy/batches', requireAuth, requireRole('pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const { drug_id, drug_name, lot, expiry_date, qty_received, cost_price, supplier_id } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (!expiry_date || !/^\d{4}-\d{2}-\d{2}$/.test(String(expiry_date))) {

            return res.status(400).json({ error: 'expiry_date (YYYY-MM-DD) required' });

        }

        const qty = parseInt(qty_received, 10) || 0;

        if (qty <= 0) return res.status(400).json({ error: 'qty_received must be > 0' });

        // IDOR: if a drug_id is given, it must belong to this tenant.

        if (drug_id) {

            const d = (await pool.query('SELECT id FROM pharmacy_drug_catalog WHERE id=$1 AND tenant_id=$2', [drug_id, tenantId])).rows[0];

            if (!d) return res.status(404).json({ error: 'Drug not found' });

        }

        const r = await pool.query(

            `INSERT INTO drug_batches (tenant_id, branch_id, drug_id, drug_name, lot, expiry_date, qty_received, qty_on_hand, cost_price, supplier_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$7,$8,$9) RETURNING *`,

            [tenantId, facilityId || null, drug_id || null, drug_name || '', lot || '', expiry_date, qty, cost_price || 0, supplier_id || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'RECEIVE_BATCH', 'Pharmacy',

            `Received batch ${lot || ''} of ${drug_name || ('#' + drug_id)} qty:${qty} exp:${expiry_date}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/pharmacy/queue/:id/verify', requireAuth, requireRole('pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const { override_reason } = req.body;

        const { tenantId } = getRequestTenantContext(req);

        // IDOR + tenant: the queue item must belong to this tenant.

        const rx = (await pool.query(

            'SELECT * FROM pharmacy_prescriptions_queue WHERE id=$1 AND tenant_id=$2', [req.params.id, tenantId])).rows[0];

        if (!rx) return res.status(404).json({ error: 'Queue item not found' });

        if (String(rx.status) === 'Dispensed') return res.status(409).json({ error: 'Already dispensed' });



        // patient allergies (tenant-scoped)

        let allergies = null;

        if (rx.patient_id) {

            const p = (await pool.query('SELECT allergies FROM patients WHERE id=$1 AND tenant_id=$2', [rx.patient_id, tenantId])).rows[0];

            allergies = p ? p.allergies : null;

        }

        // E1 CDS re-check (REUSED engine). FAIL-SAFE on engine/data errors -> warning, never silent pass.

        let alerts = [];

        try {

            alerts = alerts

                .concat(cds.checkDrugAllergy(rx.medication_name, allergies))

                .concat(cds.checkDoseRange(rx.medication_name, rx.dosage, null));

        } catch (e) {

            alerts.push({ rule: 'dose', severity: 'warning', message: 'CDS unavailable — verify manually',

                message_en: 'CDS unavailable — verify manually', message_ar: 'تعذّر تشغيل CDS — تأكد يدوياً', overridable: true, fail_safe: true });

        }

        if (rx.patient_id && rx.medication_name) {

            try {

                const activeMeds = await getPatientActiveMeds(rx.patient_id, tenantId);

                // exclude THIS queue item's own drug from the active list so it is not compared to itself

                const others = activeMeds.filter(m => String(m).trim().toLowerCase() !== String(rx.medication_name).trim().toLowerCase());

                alerts = alerts.concat(cds.checkDrugDrugInteraction([rx.medication_name].concat(others)));

            } catch (e) {

                alerts.push({ rule: 'drug-drug', severity: 'warning',

                    message: 'Active medications unavailable — interaction check inconclusive',

                    message_en: 'Active medications unavailable — interaction check inconclusive',

                    message_ar: 'تعذّر جلب الأدوية الفعالة — فحص التداخل غير حاسم', overridable: true, subjects: [], fail_safe: true });

            }

        }

        const decision = cds.decide(alerts, override_reason);

        if (!decision.allow) {

            logAudit(req.session.user?.id, req.session.user?.display_name, 'CDS_BLOCK', 'Pharmacy',

                `Pharmacist verify blocked queue #${req.params.id} (${rx.medication_name}): ${alerts.filter(a => a.severity === 'critical').map(a => a.message_en || a.message).join('; ').slice(0, 200)}`, req.ip);

            return res.status(422).json({ error: 'CDS hard-stop', blocked: true, requires_override_reason: true, alerts });

        }

        const criticals = alerts.filter(a => a.severity === 'critical');

        if (criticals.length > 0 && decision.reason) {

            logAudit(req.session.user?.id, req.session.user?.display_name, 'CDS_OVERRIDE', 'Pharmacy',

                `Pharmacist override (CRITICAL) verify queue #${req.params.id} (${rx.medication_name}). Reason: ${String(decision.reason).slice(0, 160)}. Alerts: ${criticals.map(a => a.message_en || a.message).join('; ').slice(0, 200)}`, req.ip);

        }

        await pool.query(

            "UPDATE pharmacy_prescriptions_queue SET status='Verified', verified_by=$1, verified_at=CURRENT_TIMESTAMP WHERE id=$2 AND tenant_id=$3",

            [req.session.user?.id || 0, req.params.id, tenantId]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'PHARMACY_VERIFY', 'Pharmacy',

            `Verified queue #${req.params.id} (${rx.medication_name})`, req.ip);

        res.json({ success: true, status: 'Verified', alerts });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/pharmacy/dispense', requireAuth, requireRole('pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const { prescription_id, barcode, drug_id: bodyDrugId, quantity, witness_user_id, price, payment_method } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const qty = parseInt(quantity, 10) || 0;

        if (qty <= 0) return res.status(400).json({ error: 'quantity must be > 0' });



        // 1) Resolve + tenant-check the queue item; it MUST be Verified before any stock moves.

        const rx = (await pool.query(

            'SELECT * FROM pharmacy_prescriptions_queue WHERE id=$1 AND tenant_id=$2', [prescription_id, tenantId])).rows[0];

        if (!rx) return res.status(404).json({ error: 'Queue item not found' });

        if (String(rx.status) === 'Dispensed') return res.status(409).json({ error: 'Already dispensed' });

        if (String(rx.status) !== 'Verified') return res.status(409).json({ error: 'Prescription must be Verified before dispensing' });



        // 2) Resolve the drug (by barcode or drug_id), tenant-scoped (IDOR + RLS).

        let drug;

        if (barcode) {

            drug = (await pool.query('SELECT * FROM pharmacy_drug_catalog WHERE barcode=$1 AND tenant_id=$2', [barcode, tenantId])).rows[0];

        } else if (bodyDrugId) {

            drug = (await pool.query('SELECT * FROM pharmacy_drug_catalog WHERE id=$1 AND tenant_id=$2', [bodyDrugId, tenantId])).rows[0];

        }

        if (!drug) return res.status(404).json({ error: 'Drug not found' });



        // 3) Controlled fail-closed: a controlled/high-alert drug CANNOT be dispensed without a witness.

        const isControlled = !!(drug.is_controlled && Number(drug.is_controlled) > 0);

        if (isControlled && !witness_user_id) {

            return res.status(422).json({ error: 'Controlled drug requires a second witness', requires_witness: true });

        }

        if (isControlled && witness_user_id && String(witness_user_id) === String(req.session.user?.id)) {

            return res.status(422).json({ error: 'Witness must be a different user', requires_witness: true });

        }



        // 4) Transactional FEFO decrement + dispense ledger (+ controlled double-log) + invoice.

        const result = await withPharmacyTx(tenantId, async (client) => {

            // FEFO: earliest NON-EXPIRED batch first; lock rows to avoid concurrent over-dispense.

            const batches = (await client.query(

                `SELECT * FROM drug_batches

                 WHERE tenant_id=$1 AND drug_id=$2 AND qty_on_hand > 0 AND expiry_date >= CURRENT_DATE

                 ORDER BY expiry_date ASC, id ASC

                 FOR UPDATE`,

                [tenantId, drug.id])).rows;

            const totalAvailable = batches.reduce((s, b) => s + (parseInt(b.qty_on_hand, 10) || 0), 0);

            if (totalAvailable < qty) {

                return { conflict: true, available: totalAvailable };

            }

            // I2: controlled-register balance must come from the AUTHORITATIVE batch sum

            // (SUM(drug_batches.qty_on_hand)), not the denormalized catalog stock_qty. Computed

            // here under the FOR UPDATE lock, tenant-scoped, so it is consistent within the tx.

            const balanceBefore = parseInt((await client.query(

                'SELECT COALESCE(SUM(qty_on_hand),0) AS bal FROM drug_batches WHERE tenant_id=$1 AND drug_id=$2',

                [tenantId, drug.id])).rows[0].bal, 10) || 0;

            const balanceAfter = balanceBefore - qty;

            let remaining = qty;

            const consumed = [];

            for (const b of batches) {

                if (remaining <= 0) break;

                const take = Math.min(remaining, parseInt(b.qty_on_hand, 10) || 0);

                const newQty = (parseInt(b.qty_on_hand, 10) || 0) - take;

                await client.query('UPDATE drug_batches SET qty_on_hand=$1 WHERE id=$2 AND tenant_id=$3', [newQty, b.id, tenantId]);

                consumed.push({ batch_id: b.id, lot: b.lot, expiry_date: b.expiry_date, qty: take });

                remaining -= take;

            }

            // keep the catalog cached stock_qty in sync (derived sum) + write the raw stock movement log.

            const prevCatalog = parseInt(drug.stock_qty, 10) || 0;

            const newCatalog = Math.max(0, prevCatalog - qty);

            await client.query('UPDATE pharmacy_drug_catalog SET stock_qty=$1 WHERE id=$2 AND tenant_id=$3', [newCatalog, drug.id, tenantId]);

            await client.query(

                'INSERT INTO pharmacy_stock_log (drug_id, drug_name, movement_type, quantity, previous_qty, new_qty, reason, patient_id, prescription_id, performed_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',

                [drug.id, drug.drug_name, 'OUT', qty, prevCatalog, newCatalog, 'Dispensed (FEFO)', rx.patient_id, prescription_id, req.session.user?.display_name || '']);



            // dispense ledger line (one per FEFO batch consumed)

            const dispenseIds = [];

            for (const c of consumed) {

                const d = await client.query(

                    `INSERT INTO pharmacy_dispense (tenant_id, branch_id, prescription_id, patient_id, drug_id, drug_batch_id, drug_name, qty, verified_by, verified_at, dispensed_by, status)

                     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'Dispensed') RETURNING id`,

                    [tenantId, facilityId || null, prescription_id, rx.patient_id, drug.id, c.batch_id, drug.drug_name, c.qty, rx.verified_by || null, rx.verified_at || null, req.session.user?.id || 0]);

                dispenseIds.push(d.rows[0].id);

            }



            // controlled double-entry register (fail-closed witness already enforced above)

            if (isControlled) {

                await client.query(

                    `INSERT INTO controlled_drug_log (tenant_id, branch_id, drug_id, drug_name, drug_batch_id, dispense_id, prescription_id, patient_id, qty, balance_before, balance_after, schedule_class, dispensed_by, witnessed_by)

                     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,

                    [tenantId, facilityId || null, drug.id, drug.drug_name, consumed[0] ? consumed[0].batch_id : null, dispenseIds[0] || null,

                     prescription_id, rx.patient_id, qty, balanceBefore, balanceAfter, drug.schedule_class || 'controlled', req.session.user?.id || 0, witness_user_id]);

            }



            // mark the queue item Dispensed

            await client.query(

                "UPDATE pharmacy_prescriptions_queue SET status='Dispensed', dispensed_by=$1, dispensed_at=CURRENT_TIMESTAMP, price=$2, payment_method=$3 WHERE id=$4 AND tenant_id=$5",

                [req.session.user?.display_name || '', price || 0, payment_method || 'Cash', prescription_id, tenantId]);



            // invoice (VAT) when priced — mirror the legacy dispense path

            if (price && price > 0 && rx.patient_id) {

                const patient = (await client.query('SELECT name_ar, name_en FROM patients WHERE id=$1 AND tenant_id=$2', [rx.patient_id, tenantId])).rows[0];

                const vat = await calcVAT(rx.patient_id);

                const { total: finalTotal, vatAmount } = addVAT(price, vat.rate);

                await client.query(

                    `INSERT INTO invoices (patient_id, patient_name, total, amount, vat_amount, description, service_type, paid, payment_method, tenant_id, facility_id)

                     VALUES ($1,$2,$3,$4,$5,$6,'Pharmacy',1,$7,$8,$9)`,

                    [rx.patient_id, patient?.name_ar || patient?.name_en || '', finalTotal, price, vatAmount,

                     `Pharmacy: ${rx.prescription_text || drug.drug_name}`, payment_method || 'Cash', tenantId, facilityId || null]);

            }



            // near-expiry / low-stock notifications (best-effort, inside tx)

            if (newCatalog <= (drug.min_qty || drug.min_stock_level || 10)) {

                await client.query('INSERT INTO notifications (target_role, title, message, type, module) VALUES ($1,$2,$3,$4,$5)',

                    ['Pharmacist', 'Low Stock Alert', `${drug.drug_name} stock: ${newCatalog}`, 'warning', 'Pharmacy']);

            }

            return { consumed, dispenseIds, new_stock: newCatalog, isControlled };

        });



        if (result && result.conflict) {

            return res.status(409).json({ error: 'Insufficient stock', available: result.available });

        }

        logAudit(req.session.user?.id, req.session.user?.display_name, 'DISPENSE_FEFO', 'Pharmacy',

            `FEFO dispense queue #${prescription_id} ${drug.drug_name} qty:${qty} batches:${result.consumed.map(c => c.lot || c.batch_id).join(',')}`, req.ip);

        if (result.isControlled) {

            logAudit(req.session.user?.id, req.session.user?.display_name, 'CONTROLLED_DISPENSE', 'Pharmacy',

                `Controlled dispense ${drug.drug_name} qty:${qty} witness:#${witness_user_id} (double-logged)`, req.ip);

            logAudit(witness_user_id, '(witness)', 'CONTROLLED_WITNESS', 'Pharmacy',

                `Witnessed controlled dispense ${drug.drug_name} qty:${qty} dispenser:#${req.session.user?.id}`, req.ip);

        }

        res.json({ success: true, dispensed: qty, batches: result.consumed, new_stock: result.new_stock });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/pharmacy/wasfaty/dispense-intent', requireAuth, requireRole('pharmacy'), requireTenantScope, async (req, res) => {

    if (String(process.env.WASFATY_ENABLED || '').toLowerCase() !== 'true') {

        return res.status(503).json({ error: 'Wasfaty/NPHIES integration disabled', enabled: false });

    }

    try {

        const { prescription_id } = req.body;

        const { tenantId } = getRequestTenantContext(req);

        // stub: verify the rx belongs to this tenant, then record intent. No external network I/O.

        const rx = (await pool.query('SELECT id FROM pharmacy_prescriptions_queue WHERE id=$1 AND tenant_id=$2', [prescription_id, tenantId])).rows[0];

        if (!rx) return res.status(404).json({ error: 'Queue item not found' });

        logAudit(req.session.user?.id, req.session.user?.display_name, 'WASFATY_INTENT', 'Pharmacy',

            `Recorded Wasfaty coverage intent for queue #${prescription_id} (stub, no external call)`, req.ip);

        res.json({ success: true, recorded: true, external_call: false, note: 'stub — coverage intent recorded only' });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/pharmacy/deduct-stock', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { drug_id, drug_name, quantity, patient_id, prescription_id, reason } = req.body;

        const { tenantId } = getRequestTenantContext(req);



        // IDOR Prevention: check if drug belongs to tenant

        const drugQuery = tenantId ?

            'SELECT * FROM pharmacy_drug_catalog WHERE id=$1 AND tenant_id=$2' :

            'SELECT * FROM pharmacy_drug_catalog WHERE id=$1';

        const drugParams = tenantId ? [drug_id, tenantId] : [drug_id];

        const drug = (await pool.query(drugQuery, drugParams)).rows[0];

        if (!drug) return res.status(404).json({ error: 'Drug not found' });



        // IDOR Prevention: check if patient belongs to tenant

        if (tenantId && patient_id) {

            const patientCheck = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

            if (!patientCheck) return res.status(404).json({ error: 'Patient not found' });

        }



        // IDOR Prevention: check if prescription belongs to tenant

        if (tenantId && prescription_id) {

            const rxCheck = (await pool.query('SELECT id FROM prescriptions WHERE id=$1 AND tenant_id=$2', [prescription_id, tenantId])).rows[0];

            if (!rxCheck) return res.status(404).json({ error: 'Prescription not found' });

        }



        if (drug.stock_qty < quantity) return res.status(400).json({ error: 'Insufficient stock', available: drug.stock_qty });

        const newQty = drug.stock_qty - quantity;

        const updateQuery = tenantId ?

            'UPDATE pharmacy_drug_catalog SET stock_qty=$1 WHERE id=$2 AND tenant_id=$3' :

            'UPDATE pharmacy_drug_catalog SET stock_qty=$1 WHERE id=$2';

        const updateParams = tenantId ? [newQty, drug_id, tenantId] : [newQty, drug_id];

        await pool.query(updateQuery, updateParams);



        await pool.query('INSERT INTO pharmacy_stock_log (drug_id, drug_name, movement_type, quantity, previous_qty, new_qty, reason, patient_id, prescription_id, performed_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',

            [drug_id, drug_name || drug.drug_name, 'OUT', quantity, drug.stock_qty, newQty, reason || 'Dispensed', patient_id, prescription_id, req.session.user?.display_name || '']);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'STOCK_OUT', 'Pharmacy', drug_name + ': ' + drug.stock_qty + ' -> ' + newQty, req.ip);

        const isLow = newQty <= (drug.min_stock_level || 10);

        if (isLow) {

            await pool.query('INSERT INTO notifications (target_role, title, message, type, module) VALUES ($1,$2,$3,$4,$5)',

                ['Pharmacist', 'Low Stock Alert', drug_name + ' stock: ' + newQty, 'warning', 'Pharmacy']);

        }

        res.json({ success: true, previous_qty: drug.stock_qty, new_qty: newQty, is_low_stock: isLow });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/pharmacy/expiring', requireAuth, requireRole('pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const days = Math.max(1, parseInt(req.query.days, 10) || 90);

        const { tenantId } = getRequestTenantContext(req);

        // Explicit tenant_id predicate (defense-in-depth) + FORCE RLS. Per-lot DATE expiry; only

        // batches with stock on hand. Flags already-expired vs near-expiry windows.

        const query =

            `SELECT b.*, (b.expiry_date < CURRENT_DATE) AS is_expired

             FROM drug_batches b

             WHERE b.tenant_id=$1 AND b.qty_on_hand > 0

               AND b.expiry_date <= (CURRENT_DATE + ($2::int * INTERVAL '1 day'))

             ORDER BY b.expiry_date ASC`;

        const expiring = (await pool.query(query, [tenantId, days])).rows;

        res.json(expiring);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/pharmacy/stock-log', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const query = tenantId ?

            `SELECT sl.* FROM pharmacy_stock_log sl

             JOIN pharmacy_drug_catalog dc ON sl.drug_id = dc.id

             WHERE dc.tenant_id = $1

             ORDER BY sl.created_at DESC LIMIT 200` :

            `SELECT * FROM pharmacy_stock_log ORDER BY created_at DESC LIMIT 200`;

        const params = tenantId ? [tenantId] : [];

        res.json((await pool.query(query, params)).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/pharmacy/prescriptions', requireAuth, requireTenantScope, async (req, res) => {

    try {

        // pharmacy_prescriptions schema provisioned out-of-band (route_level_ddl_batch_b); no DDL in handler



        const { tenantId } = getRequestTenantContext(req);

        const query = tenantId ?

            'SELECT * FROM pharmacy_prescriptions WHERE tenant_id=$1 ORDER BY created_at DESC' :

            'SELECT * FROM pharmacy_prescriptions ORDER BY created_at DESC';

        const params = tenantId ? [tenantId] : [];

        res.json((await pool.query(query, params)).rows);

    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/pharmacy/prescriptions', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id, patient_name, medication, drug_name, dosage, frequency, duration, quantity, doctor, status, notes } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (tenantId && patient_id) {

            const patientCheck = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

            if (!patientCheck) return res.status(404).json({ error: 'Patient not found' });

        }

        const r = await pool.query('INSERT INTO pharmacy_prescriptions (patient_id,patient_name,medication,drug_name,dosage,frequency,duration,quantity,doctor,status,notes,tenant_id,facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',

            [patient_id, patient_name, medication || drug_name, drug_name || medication, dosage, frequency, duration, quantity, doctor, status || 'pending', notes, tenantId || null, facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_PHARMACY_PRESCRIPTION', 'Pharmacy',

            `Created prescription for patient #${patient_id}: ${medication || drug_name}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/pharmacy/prescriptions/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { status } = req.body;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const params = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const check = (await pool.query(`SELECT id FROM pharmacy_prescriptions WHERE id=$1${tenantCheck}`, params)).rows[0];

        if (!check) return res.status(404).json({ error: 'Prescription not found' });



        const updateQuery = tenantId ?

            'UPDATE pharmacy_prescriptions SET status=$1 WHERE id=$2 AND tenant_id=$3 RETURNING *' :

            'UPDATE pharmacy_prescriptions SET status=$1 WHERE id=$2 RETURNING *';

        const updateParams = tenantId ? [status, req.params.id, tenantId] : [status, req.params.id];

        const r = await pool.query(updateQuery, updateParams);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_PHARMACY_PRESCRIPTION', 'Pharmacy',

            `Updated prescription #${req.params.id} status:${status}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/pharmacy/controlled-substances', requireAuth, requireRole('pharmacist', 'pharmacy', 'admin'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { date, location } = req.query;

        let q = 'SELECT * FROM pharmacy_controlled_substances WHERE tenant_id=$1';

        const params = [tid];

        if (date) { params.push(date); q += ` AND record_date=$${params.length}`; }

        if (location) { params.push(location); q += ` AND location=$${params.length}`; }

        q += ' ORDER BY record_date DESC, drug_name ASC';

        const rows = await pool.query(q, params);

        res.json(rows.rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/pharmacy/controlled-substances/reconcile', requireAuth, requireRole('pharmacist', 'pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { drug_name, drug_code, schedule_class, dosage_form, strength, unit, opening_balance, received_qty, dispensed_qty, wasted_qty, closing_balance, discrepancy, record_date, location, witnessed_by, notes } = req.body;

        if (!drug_name || !drug_code) return res.status(400).json({ error: 'drug_name and drug_code required' });

        

        const dateStr = record_date || new Date().toISOString().slice(0, 10);

        const loc = location || 'Main Pharmacy';

        

        const r = await pool.query(

            `INSERT INTO pharmacy_controlled_substances 

                (drug_name, drug_code, schedule_class, dosage_form, strength, unit, opening_balance, received_qty, dispensed_qty, wasted_qty, closing_balance, discrepancy, record_date, location, witnessed_by, verified_by, notes, tenant_id)

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)

             ON CONFLICT (drug_code, record_date, location, tenant_id) 

             DO UPDATE SET 

                closing_balance = $11, discrepancy = $12, witnessed_by = $15, verified_by = $16, notes = $17

             RETURNING *`,

            [drug_name, drug_code, schedule_class || '2', dosage_form || '', strength || '', unit || 'Tablet', 

             parseFloat(opening_balance) || 0, parseFloat(received_qty) || 0, parseFloat(dispensed_qty) || 0, parseFloat(wasted_qty) || 0, 

             parseFloat(closing_balance) || 0, parseFloat(discrepancy) || 0, dateStr, loc, witnessed_by || '', req.session.user.display_name, notes || '', tid]

        );

        logAudit(req.session.user.id, req.session.user.display_name, 'CS_STOCK_RECONCILE', 'Pharmacy', `Controlled substance reconcile: ${drug_name} at ${loc}`, tid);

        res.json({ success: true, record: r.rows[0] });

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/pharmacy/controlled-substances/dispense', requireAuth, requireRole('pharmacist', 'pharmacy', 'nurse'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { cs_id, prescription_id, patient_id, quantity, witness2_name, witness2_id, reason, waste_amount, waste_reason } = req.body;

        if (!cs_id || !quantity) return res.status(400).json({ error: 'cs_id and quantity required' });

        

        // Verify Controlled Substance record

        const csCheck = await pool.query('SELECT * FROM pharmacy_controlled_substances WHERE id=$1 AND tenant_id=$2', [parseInt(cs_id), tid]);

        if (!csCheck.rows.length) return res.status(404).json({ error: 'Controlled substance stock record not found' });

        const cs = csCheck.rows[0];

        

        // IDOR: verify prescription if provided

        if (prescription_id) {

            const rxCheck = await pool.query('SELECT id FROM pharmacy_prescriptions WHERE id=$1 AND tenant_id=$2', [parseInt(prescription_id), tid]);

            if (!rxCheck.rows.length) return res.status(403).json({ error: 'Prescription access denied' });

        }

        

        let patName = '';

        if (patient_id) {

            const patCheck = await pool.query('SELECT name_en, name_ar FROM patients WHERE id=$1 AND tenant_id=$2', [parseInt(patient_id), tid]);

            if (patCheck.rows.length) patName = patCheck.rows[0].name_en || patCheck.rows[0].name_ar || '';

        }

        

        const qty = parseFloat(quantity);

        const waste = parseFloat(waste_amount) || 0;

        const newBal = parseFloat(cs.closing_balance) - qty - waste;

        

        // Insert transaction with Double-Witness log

        const tx = await pool.query(

            `INSERT INTO pharmacy_cs_transactions 

                (cs_id, prescription_id, patient_id, patient_name, transaction_type, quantity, balance_after, witness1_name, witness2_name, witness1_id, witness2_id, reason, waste_amount, waste_reason, is_signed, tenant_id)

             VALUES ($1, $2, $3, $4, 'Dispense', $5, $6, $7, $8, $9, $10, $11, $12, $13, TRUE, $14) RETURNING *`,

            [parseInt(cs_id), prescription_id ? parseInt(prescription_id) : null, patient_id ? parseInt(patient_id) : null, patName, qty, newBal, 

             req.session.user.display_name, witness2_name || '', req.session.user.id, witness2_id ? parseInt(witness2_id) : null, reason || '', waste, waste_reason || '', tid]

        );

        

        // Update Controlled Substance stock balance

        await pool.query(

            'UPDATE pharmacy_controlled_substances SET closing_balance=$1, dispensed_qty=dispensed_qty+$2, wasted_qty=wasted_qty+$3 WHERE id=$4 AND tenant_id=$5',

            [newBal, qty, waste, parseInt(cs_id), tid]

        );

        

        logAudit(req.session.user.id, req.session.user.display_name, 'CS_DISPENSE_DOUBLE_SIGNED', 'Pharmacy', `CS Dispense: ${cs.drug_name} Qty ${qty} (Witnessed by: ${witness2_name})`, tid);

        res.json({ success: true, transaction: tx.rows[0], balance_after: newBal });

    } catch (e) { res.status(500).json({ error: e.message }); }

});


    return router;
}
