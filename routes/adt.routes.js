const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeAdtRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, E8_ADMISSION_TERMINAL, E8_BED_FREE_STATES, E8_BED_STATUSES, e8CanTransitionBed, e8IntId, e8RequireTenant }) {
    const router = express.Router();
router.get('/api/adt/beds', requireAuth, requireRole('inpatient', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e8RequireTenant(req);

        const wardId = e8IntId(req.query.ward_id);

        const params = [tenantId];

        let where = 'b.tenant_id = $1';

        if (wardId) { params.push(wardId); where += ` AND b.ward_id = $${params.length}`; }

        const rows = (await pool.query(

            `SELECT b.id, b.bed_number, b.bed_type, b.room_number, b.status, b.ward_id,

                    b.current_patient_id, b.current_admission_id, b.isolation_type,

                    w.ward_name, w.ward_name_ar, w.ward_type,

                    a.patient_name, a.diagnosis, a.attending_doctor, a.admission_date

             FROM beds b

             JOIN wards w ON b.ward_id = w.id AND w.tenant_id = $1

             LEFT JOIN admissions a ON b.current_admission_id = a.id AND a.status='Active' AND a.tenant_id = $1

             WHERE ${where}

             ORDER BY w.id, b.bed_number`, params)).rows;

        res.json({ beds: rows, statuses: E8_BED_STATUSES });

    } catch (e) {

        if (e.e8Status) return res.status(e.e8Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/adt/census', requireAuth, requireRole('inpatient', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e8RequireTenant(req);

        const wards = (await pool.query('SELECT * FROM wards WHERE tenant_id=$1 ORDER BY id', [tenantId])).rows;

        const beds = (await pool.query(

            `SELECT b.id, b.bed_number, b.room_number, b.status, b.ward_id,

                    w.ward_name, w.ward_name_ar, w.ward_type,

                    a.patient_name, a.diagnosis, a.admission_date, a.attending_doctor

             FROM beds b

             JOIN wards w ON b.ward_id = w.id AND w.tenant_id = $1

             LEFT JOIN admissions a ON b.current_admission_id = a.id AND a.status='Active' AND a.tenant_id = $1

             WHERE b.tenant_id = $1

             ORDER BY w.id, b.bed_number`, [tenantId])).rows;



        const total = beds.length;

        const occupied = beds.filter(b => b.status === 'Occupied').length;

        const available = beds.filter(b => b.status === 'Available').length;

        const cleaning = beds.filter(b => b.status === 'Cleaning').length;

        const reserved = beds.filter(b => b.status === 'Reserved').length;

        const blocked = beds.filter(b => b.status === 'Blocked').length;

        const byWard = wards.map(w => {

            const wb = beds.filter(b => b.ward_id === w.id);

            return {

                ward_id: w.id, ward_name: w.ward_name, ward_name_ar: w.ward_name_ar, ward_type: w.ward_type,

                total: wb.length,

                occupied: wb.filter(b => b.status === 'Occupied').length,

                available: wb.filter(b => b.status === 'Available').length,

                cleaning: wb.filter(b => b.status === 'Cleaning').length,

                reserved: wb.filter(b => b.status === 'Reserved').length,

                blocked: wb.filter(b => b.status === 'Blocked').length

            };

        });

        res.json({

            wards, beds, byWard, total, occupied, available, cleaning, reserved, blocked,

            occupancyRate: total > 0 ? Math.round(occupied / total * 100) : 0

        });

    } catch (e) {

        if (e.e8Status) return res.status(e.e8Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/adt/admit', requireAuth, requireRole('inpatient', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    let began = false;

    try {

        const { tenantId, facilityId } = e8RequireTenant(req);

        const bedId = e8IntId(req.body.bed_id);

        if (!bedId) { client.release(); return res.status(422).json({ error: 'bed_id is required' }); }

        const admissionId = e8IntId(req.body.admission_id);

        const patientId = e8IntId(req.body.patient_id);



        await client.query('BEGIN'); began = true;



        // Lock the destination bed row inside the txn — prevents two concurrent admits

        // from both seeing it free and double-occupying it.

        const bed = (await client.query(

            'SELECT id, ward_id, status, current_admission_id FROM beds WHERE id=$1 AND tenant_id=$2 FOR UPDATE',

            [bedId, tenantId])).rows[0];

        if (!bed) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Bed not found' }); }

        if (!E8_BED_FREE_STATES.includes(bed.status)) {

            await client.query('ROLLBACK'); client.release();

            return res.status(409).json({ error: `Bed not available (status ${bed.status})` });

        }



        let admission;

        if (admissionId) {

            // Mode (a): place an existing Active admission (no bed yet) into this bed.

            admission = (await client.query(

                'SELECT id, patient_id, status, bed_id FROM admissions WHERE id=$1 AND tenant_id=$2 FOR UPDATE',

                [admissionId, tenantId])).rows[0];

            if (!admission) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Admission not found' }); }

            if (admission.status !== 'Active') {

                await client.query('ROLLBACK'); client.release();

                return res.status(409).json({ error: `Cannot place a ${admission.status} admission into a bed` });

            }

            if (admission.bed_id) {

                await client.query('ROLLBACK'); client.release();

                return res.status(409).json({ error: 'Admission already occupies a bed; use transfer' });

            }

            await client.query(

                'UPDATE admissions SET ward_id=$1, bed_id=$2 WHERE id=$3 AND tenant_id=$4',

                [bed.ward_id, bedId, admissionId, tenantId]);

        } else {

            // Mode (b): create a new admission. Verify patient ownership (IDOR guard).

            if (!patientId) { await client.query('ROLLBACK'); client.release(); return res.status(422).json({ error: 'patient_id or admission_id is required' }); }

            const patient = (await client.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patientId, tenantId])).rows[0];

            if (!patient) { await client.query('ROLLBACK'); client.release(); return res.status(403).json({ error: 'Invalid patient context or access denied' }); }

            const b = req.body;

            admission = (await client.query(

                `INSERT INTO admissions (patient_id, patient_name, admission_type, admitting_doctor, attending_doctor, department, ward_id, bed_id, diagnosis, icd10_code, diet_order, expected_los, status, tenant_id, facility_id)

                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'Active',$13,$14) RETURNING id, patient_id`,

                [patientId, b.patient_name || '', b.admission_type || 'Regular', b.admitting_doctor || '', b.attending_doctor || '',

                 b.department || '', bed.ward_id, bedId, b.diagnosis || '', b.icd10_code || '', b.diet_order || 'Regular',

                 e8IntId(b.expected_los) || 3, tenantId, facilityId])).rows[0];

        }



        // Occupy the (locked) bed — server-side authority; status not trusted from client.

        await client.query(

            "UPDATE beds SET status='Occupied', current_patient_id=$1, current_admission_id=$2 WHERE id=$3 AND tenant_id=$4",

            [admission.patient_id, admission.id, bedId, tenantId]);

        // Reflect on the patient record.

        if (admission.patient_id) {

            await client.query("UPDATE patients SET status='Admitted' WHERE id=$1 AND tenant_id=$2", [admission.patient_id, tenantId]);

        }



        await client.query('COMMIT'); client.release();

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ADT_ADMIT', 'Inpatient',

            `Admitted patient #${admission.patient_id} -> admission #${admission.id} into bed #${bedId}`, req.ip);

        res.json({ success: true, admission_id: admission.id, bed_id: bedId, bed_status: 'Occupied' });

    } catch (e) {

        if (began) { try { await client.query('ROLLBACK'); } catch (_) {} }

        client.release();

        if (e.e8Status) return res.status(e.e8Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/adt/transfer', requireAuth, requireRole('inpatient', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    let began = false;

    try {

        const { tenantId, facilityId } = e8RequireTenant(req);

        const admissionId = e8IntId(req.body.admission_id);

        const toBed = e8IntId(req.body.to_bed);

        if (!admissionId || !toBed) { client.release(); return res.status(422).json({ error: 'admission_id and to_bed are required' }); }



        await client.query('BEGIN'); began = true;



        const admission = (await client.query(

            'SELECT id, patient_id, status, ward_id, bed_id FROM admissions WHERE id=$1 AND tenant_id=$2 FOR UPDATE',

            [admissionId, tenantId])).rows[0];

        if (!admission) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Admission not found' }); }

        if (admission.status !== 'Active') {

            await client.query('ROLLBACK'); client.release();

            return res.status(409).json({ error: `Cannot transfer a ${admission.status} admission` });

        }

        const fromBed = admission.bed_id;

        if (fromBed && fromBed === toBed) {

            await client.query('ROLLBACK'); client.release();

            return res.status(409).json({ error: 'Source and destination beds are the same' });

        }



        // C2 fix — deadlock avoidance: lock BOTH beds in a CONSISTENT ascending-id order,

        // regardless of which is source vs destination. Two reverse-direction concurrent

        // transfers (A->B and B->A) previously deadlocked because each locked its own

        // destination first. Acquiring row locks in a global order (ascending id) guarantees

        // no AB/BA cycle. We collect the locked rows into a map, then resolve src/dest below.

        const lockIds = [toBed, fromBed].filter(Boolean).sort((a, b) => a - b);

        const locked = {};

        for (const lid of lockIds) {

            const row = (await client.query(

                'SELECT id, ward_id, status FROM beds WHERE id=$1 AND tenant_id=$2 FOR UPDATE',

                [lid, tenantId])).rows[0];

            if (row) locked[lid] = row;

        }



        const dest = locked[toBed] || null;

        if (!dest) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Destination bed not found' }); }

        if (!E8_BED_FREE_STATES.includes(dest.status)) {

            await client.query('ROLLBACK'); client.release();

            return res.status(409).json({ error: `Destination bed not available (status ${dest.status})` });

        }



        const src = fromBed ? (locked[fromBed] || null) : null;



        // Free the source bed -> Cleaning (housekeeping), then occupy the destination.

        if (src) {

            await client.query(

                "UPDATE beds SET status='Cleaning', current_patient_id=0, current_admission_id=0 WHERE id=$1 AND tenant_id=$2",

                [fromBed, tenantId]);

        }

        await client.query(

            "UPDATE beds SET status='Occupied', current_patient_id=$1, current_admission_id=$2 WHERE id=$3 AND tenant_id=$4",

            [admission.patient_id, admissionId, toBed, tenantId]);

        await client.query(

            'UPDATE admissions SET ward_id=$1, bed_id=$2 WHERE id=$3 AND tenant_id=$4',

            [dest.ward_id, toBed, admissionId, tenantId]);

        // History (bed_transfers uses branch_id = facilityId, per legacy schema).

        await client.query(

            `INSERT INTO bed_transfers (admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by, transfer_date, tenant_id, branch_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,

            [admissionId, admission.patient_id, admission.ward_id, fromBed, dest.ward_id, toBed,

             req.body.transfer_reason || '', req.session.user?.display_name || '', new Date().toISOString(), tenantId, facilityId]);



        await client.query('COMMIT'); client.release();

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ADT_TRANSFER', 'Inpatient',

            `Transferred admission #${admissionId} (patient #${admission.patient_id}) from bed #${fromBed || '-'} to bed #${toBed}`, req.ip);

        res.json({ success: true, admission_id: admissionId, from_bed: fromBed, to_bed: toBed });

    } catch (e) {

        if (began) { try { await client.query('ROLLBACK'); } catch (_) {} }

        client.release();

        if (e.e8Status) return res.status(e.e8Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/adt/discharge', requireAuth, requireRole('inpatient', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    let began = false;

    try {

        const { tenantId } = e8RequireTenant(req);

        const admissionId = e8IntId(req.body.admission_id);

        if (!admissionId) { client.release(); return res.status(422).json({ error: 'admission_id is required' }); }



        await client.query('BEGIN'); began = true;



        const adm = (await client.query(

            'SELECT id, patient_id, bed_id, status FROM admissions WHERE id=$1 AND tenant_id=$2 FOR UPDATE',

            [admissionId, tenantId])).rows[0];

        if (!adm) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Admission not found' }); }

        if (E8_ADMISSION_TERMINAL.includes(adm.status)) {

            await client.query('ROLLBACK'); client.release();

            return res.status(409).json({ error: `Admission already ${adm.status}` });

        }



        const b = req.body;

        await client.query(

            `UPDATE admissions SET status='Discharged', discharge_date=$1, discharge_type=$2, discharge_summary=$3,

                    discharge_instructions=$4, discharge_medications=$5, followup_date=$6, followup_doctor=$7

             WHERE id=$8 AND tenant_id=$9`,

            [new Date().toISOString(), b.discharge_type || 'Regular', b.discharge_summary || '',

             b.discharge_instructions || '', b.discharge_medications || '', b.followup_date || null,

             b.followup_doctor || '', admissionId, tenantId]);



        // Free the bed -> Cleaning (housekeeping turnover) per the bed lifecycle.

        if (adm.bed_id) {

            const bed = (await client.query(

                'SELECT id, status FROM beds WHERE id=$1 AND tenant_id=$2 FOR UPDATE',

                [adm.bed_id, tenantId])).rows[0];

            if (bed) {

                await client.query(

                    "UPDATE beds SET status='Cleaning', current_patient_id=0, current_admission_id=0 WHERE id=$1 AND tenant_id=$2",

                    [adm.bed_id, tenantId]);

            }

        }

        if (adm.patient_id) {

            await client.query("UPDATE patients SET status='Discharged' WHERE id=$1 AND tenant_id=$2", [adm.patient_id, tenantId]);

        }



        await client.query('COMMIT'); client.release();

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ADT_DISCHARGE', 'Inpatient',

            `Discharged admission #${admissionId} (patient #${adm.patient_id}); freed bed #${adm.bed_id || '-'} -> Cleaning`, req.ip);

        res.json({ success: true, admission_id: admissionId, bed_id: adm.bed_id || null, bed_status: adm.bed_id ? 'Cleaning' : null });

    } catch (e) {

        if (began) { try { await client.query('ROLLBACK'); } catch (_) {} }

        client.release();

        if (e.e8Status) return res.status(e.e8Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/adt/bed-status', requireAuth, requireRole('inpatient', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    let began = false;

    try {

        const { tenantId } = e8RequireTenant(req);

        const bedId = e8IntId(req.body.bed_id);

        const status = req.body.status;

        if (!bedId) { client.release(); return res.status(422).json({ error: 'bed_id is required' }); }

        if (!E8_BED_STATUSES.includes(status)) { client.release(); return res.status(422).json({ error: 'Invalid bed status', allowed: E8_BED_STATUSES }); }



        await client.query('BEGIN'); began = true;

        const bed = (await client.query(

            'SELECT id, status, current_admission_id FROM beds WHERE id=$1 AND tenant_id=$2 FOR UPDATE',

            [bedId, tenantId])).rows[0];

        if (!bed) { await client.query('ROLLBACK'); client.release(); return res.status(404).json({ error: 'Bed not found' }); }

        // An Occupied bed can only be freed by discharge/transfer, never by a raw status flip.

        if (bed.status === 'Occupied') {

            await client.query('ROLLBACK'); client.release();

            return res.status(409).json({ error: 'Occupied bed must be freed via discharge or transfer' });

        }

        if (!e8CanTransitionBed(bed.status, status)) {

            await client.query('ROLLBACK'); client.release();

            return res.status(409).json({ error: `Invalid bed transition ${bed.status} -> ${status}` });

        }

        await client.query('UPDATE beds SET status=$1 WHERE id=$2 AND tenant_id=$3', [status, bedId, tenantId]);

        await client.query('COMMIT'); client.release();

        logAudit(req.session.user?.id, req.session.user?.display_name, 'ADT_BED_STATUS', 'Inpatient',

            `Bed #${bedId} status ${bed.status} -> ${status}`, req.ip);

        res.json({ success: true, bed_id: bedId, status });

    } catch (e) {

        if (began) { try { await client.query('ROLLBACK'); } catch (_) {} }

        client.release();

        if (e.e8Status) return res.status(e.e8Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
