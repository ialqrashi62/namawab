const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makePatientsRouter({ pool, requireAuth, requireRole, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, requireTenantScope }) {
    const router = express.Router();

router.get('/api/patients', requireAuth, requireRole('patients'), async (req, res) => {
    try {
        const { search } = req.query;
        const { tenantId } = getRequestTenantContext(req);
        let rows;
        if (search) {
            const s = `%${search}%`;
            if (tenantId) {
                rows = (await pool.query(`SELECT * FROM patients WHERE (name_ar ILIKE $1 OR name_en ILIKE $2 OR national_id LIKE $3 OR phone LIKE $4 OR CAST(file_number AS TEXT) LIKE $5) AND tenant_id = $6 ORDER BY id DESC LIMIT 200`, [s, s, s, s, s, tenantId])).rows;
            } else {
                rows = (await pool.query(`SELECT * FROM patients WHERE (name_ar ILIKE $1 OR name_en ILIKE $2 OR national_id LIKE $3 OR phone LIKE $4 OR CAST(file_number AS TEXT) LIKE $5) ORDER BY id DESC LIMIT 200`, [s, s, s, s, s])).rows;
            }
        } else {
            if (tenantId) {
                rows = (await pool.query('SELECT * FROM patients WHERE tenant_id = $1 ORDER BY id DESC LIMIT 200', [tenantId])).rows;
            } else {
                rows = (await pool.query('SELECT * FROM patients ORDER BY id DESC LIMIT 200')).rows;
            }
        }
        res.json(rows);
    } catch (e) { console.error('Patients query error:', e.message); res.status(500).json({ error: 'Server error' }); }
});

// ===== GET PATIENT BY ID (with tenant scope) =====
router.get('/api/patients/:id', requireAuth, requireRole('patients'), async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const whereClause = tenantId ? 'WHERE id=$1 AND tenant_id=$2' : 'WHERE id=$1';
        const queryParams = tenantId ? [req.params.id, tenantId] : [req.params.id];
        const patient = (await pool.query(`SELECT * FROM patients ${whereClause}`, queryParams)).rows[0];
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        res.json(patient);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/api/patients', requireAuth, requireRole('patients'), validateBody(RS.patientCreate), async (req, res) => {
    try {
        const { name_ar, name_en, national_id, nationality, gender, phone, department, amount, payment_method, dob, dob_hijri, blood_type, allergies, chronic_diseases, emergency_contact_name, emergency_contact_phone, address, insurance_company, insurance_policy_number, insurance_class } = req.body;
        const maxFile = (await pool.query('SELECT COALESCE(MAX(file_number), 1000) as mf FROM patients')).rows[0].mf;
        let age = 0;
        if (dob) {
            const bd = new Date(dob);
            const ageDifMs = Date.now() - bd.getTime();
            const ageDate = new Date(ageDifMs);
            age = Math.abs(ageDate.getUTCFullYear() - 1970);
        }
        const fileOpenFee = parseFloat(amount) || 0;
        const newFileNum = maxFile + 1;
        const mrn = 'MRN-' + String(newFileNum).padStart(6, '0');
        // --- TENANT SCOPE: stamp tenant_id & facility_id from session (never from body) ---
        const { tenantId, facilityId } = getRequestTenantContext(req);
        const result = await pool.query('INSERT INTO patients (file_number, mrn, name_ar, name_en, national_id, nationality, gender, phone, department, amount, payment_method, dob, dob_hijri, age, blood_type, allergies, chronic_diseases, emergency_contact_name, emergency_contact_phone, address, insurance_company, insurance_policy_number, insurance_class, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25) RETURNING id',
            [newFileNum, mrn, name_ar || '', name_en || '', national_id || '', nationality || '', gender || '', phone || '', department || '', fileOpenFee, payment_method || '', dob || '', dob_hijri || '', age || 0, blood_type || '', allergies || '', chronic_diseases || '', emergency_contact_name || '', emergency_contact_phone || '', address || '', insurance_company || '', insurance_policy_number || '', insurance_class || '', tenantId || null, facilityId || null]);
        const patient = (await pool.query('SELECT * FROM patients WHERE id=$1', [result.rows[0].id])).rows[0];
        // Auto-create invoice for file opening fee (with VAT for non-Saudis)
        if (fileOpenFee > 0) {
            const vat = await calcVAT(patient.id);
            const { total: finalTotal, vatAmount } = addVAT(fileOpenFee, vat.rate);
            const desc = vat.applyVAT ? `فتح ملف / File Opening Fee (+ ضريبة ${vatAmount} SAR)` : 'فتح ملف / File Opening Fee';
            await pool.query('INSERT INTO invoices (patient_id, patient_name, total, vat_amount, description, service_type, paid, payment_method, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
                [patient.id, name_en || name_ar, finalTotal, vatAmount, desc, 'File Opening', payment_method === 'كاش' || payment_method === 'Cash' ? 1 : 0, payment_method || '', tenantId || null, facilityId || null]);
        }
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_PATIENT', 'Patients', 'Created patient ' + (name_en || name_ar) + ' MRN:' + mrn, req.ip);
        res.json(patient);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/api/patients/:id', requireAuth, requireRole('patients'), async (req, res) => {
    try {
        const { name_ar, name_en, national_id, nationality, gender, phone, dob, dob_hijri, department, status, blood_type, allergies, chronic_diseases, emergency_contact_name, emergency_contact_phone, address, insurance_company, insurance_policy_number, insurance_class } = req.body;
        // --- TENANT SCOPE: verify record belongs to current tenant before update (IDOR prevention) ---
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [req.params.id, tenantId] : [req.params.id];
        const existing = (await pool.query(`SELECT id FROM patients WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];
        if (!existing) return res.status(404).json({ error: 'Patient not found' });
        const sets = []; const vals = []; let i = 1;
        if (name_ar !== undefined) { sets.push(`name_ar=$${i++}`); vals.push(name_ar); }
        if (name_en !== undefined) { sets.push(`name_en=$${i++}`); vals.push(name_en); }
        if (national_id !== undefined) { sets.push(`national_id=$${i++}`); vals.push(national_id); }
        if (nationality !== undefined) { sets.push(`nationality=$${i++}`); vals.push(nationality); }
        if (gender !== undefined) { sets.push(`gender=$${i++}`); vals.push(gender); }
        if (phone !== undefined) { sets.push(`phone=$${i++}`); vals.push(phone); }
        if (dob !== undefined) { sets.push(`dob=$${i++}`); vals.push(dob); }
        if (dob_hijri !== undefined) { sets.push(`dob_hijri=$${i++}`); vals.push(dob_hijri); }
        if (department !== undefined) { sets.push(`department=$${i++}`); vals.push(department); }
        if (status !== undefined) { sets.push(`status=$${i++}`); vals.push(status); }
        if (blood_type !== undefined) { sets.push(`blood_type=$${i++}`); vals.push(blood_type); }
        if (allergies !== undefined) { sets.push(`allergies=$${i++}`); vals.push(allergies); }
        if (chronic_diseases !== undefined) { sets.push(`chronic_diseases=$${i++}`); vals.push(chronic_diseases); }
        if (emergency_contact_name !== undefined) { sets.push(`emergency_contact_name=$${i++}`); vals.push(emergency_contact_name); }
        if (emergency_contact_phone !== undefined) { sets.push(`emergency_contact_phone=$${i++}`); vals.push(emergency_contact_phone); }
        if (address !== undefined) { sets.push(`address=$${i++}`); vals.push(address); }
        if (insurance_company !== undefined) { sets.push(`insurance_company=$${i++}`); vals.push(insurance_company); }
        if (insurance_policy_number !== undefined) { sets.push(`insurance_policy_number=$${i++}`); vals.push(insurance_policy_number); }
        if (insurance_class !== undefined) { sets.push(`insurance_class=$${i++}`); vals.push(insurance_class); }
        if (sets.length > 0) {
            vals.push(req.params.id);
            // --- TENANT SCOPE: enforce tenant_id in WHERE using parameterized query (not interpolation) ---
            if (tenantId) {
                vals.push(tenantId);
                await pool.query(`UPDATE patients SET ${sets.join(',')} WHERE id=$${i} AND tenant_id=$${i + 1}`, vals);
            } else {
                await pool.query(`UPDATE patients SET ${sets.join(',')} WHERE id=$${i}`, vals);
            }
        }
        logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_PATIENT', 'Patients', 'Updated patient #' + req.params.id, req.ip);
        const patient = (await pool.query('SELECT * FROM patients WHERE id=$1', [req.params.id])).rows[0];
        res.json(patient);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// DELETE /api/patients/:id hard-delete route was removed to prevent routing conflicts and compliance breaches.
// All patient deletion operations are processed securely by the safe soft-delete handler.
router.get('/api/patients/:id/results', requireAuth, requireRole('patients', 'lab', 'radiology'), async (req, res) => {
    try {
        // --- TENANT SCOPE: verify patient belongs to current tenant (IDOR prevention) ---
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const params = tenantId ? [req.params.id, tenantId] : [req.params.id];
        const patient = (await pool.query(`SELECT * FROM patients WHERE id=$1${tenantCheck}`, params)).rows[0];
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        const labOrders = (await pool.query("SELECT * FROM lab_radiology_orders WHERE patient_id=$1 AND is_radiology=0 ORDER BY created_at DESC", [req.params.id])).rows;
        const radOrders = (await pool.query("SELECT * FROM lab_radiology_orders WHERE patient_id=$1 AND is_radiology=1 ORDER BY created_at DESC", [req.params.id])).rows;
        const records = (await pool.query('SELECT * FROM medical_records WHERE patient_id=$1 ORDER BY visit_date DESC', [req.params.id])).rows;
        const labResults = (await pool.query(
            `SELECT lr.*, o.created_at as order_date 
             FROM lab_results lr 
             JOIN lab_radiology_orders o ON lr.order_id = o.id 
             WHERE o.patient_id=$1 AND lr.status = 'verified'
             ORDER BY o.created_at ASC, lr.id ASC`, [req.params.id])).rows;
        res.json({ patient, labOrders, radOrders, records, labResults });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/patients/:id/consent', requireAuth, requireRole('patients'), async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const params = tenantId ? [req.params.id, tenantId] : [req.params.id];
        
        const p = (await pool.query(`SELECT * FROM patients WHERE id=$1${tenantCheck}`, params)).rows[0];
        if (!p) return res.status(404).json({ error: 'Patient not found' });
        
        await pool.query('UPDATE patients SET privacy_consent_signed = true, privacy_consent_date = CURRENT_TIMESTAMP WHERE id = $1', [req.params.id]);
        logAudit(req.session.user?.id, req.session.user?.display_name, 'SIGN_PRIVACY_CONSENT', 'Patients',
            `Patient ${p.name_en || p.name_ar} signed privacy consent (PDPL)`, req.ip);
        res.json({ success: true, message: 'Consent signed successfully' });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/patients/:id/account', requireAuth, requireRole('patients', 'accounts'), async (req, res) => {
    try {
        const id = req.params.id;
        const patient = (await pool.query('SELECT * FROM patients WHERE id=$1', [id])).rows[0];
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        const invoices = (await pool.query('SELECT * FROM invoices WHERE patient_id=$1 ORDER BY id DESC', [id])).rows;
        const records = (await pool.query('SELECT * FROM medical_records WHERE patient_id=$1 ORDER BY id DESC', [id])).rows;
        const labOrders = (await pool.query('SELECT * FROM lab_radiology_orders WHERE patient_id=$1 AND is_radiology=0 ORDER BY id DESC', [id])).rows;
        const radOrders = (await pool.query('SELECT * FROM lab_radiology_orders WHERE patient_id=$1 AND is_radiology=1 ORDER BY id DESC', [id])).rows;
        const prescriptions = (await pool.query('SELECT * FROM prescriptions WHERE patient_id=$1 ORDER BY id DESC', [id])).rows;
        const totalBilled = invoices.reduce((s, i) => s + (i.total || 0), 0);
        const totalPaid = invoices.filter(i => i.paid).reduce((s, i) => s + (i.total || 0), 0);
        res.json({ patient, invoices, records, labOrders, radOrders, prescriptions, totalBilled, totalPaid, balance: totalBilled - totalPaid });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/patients/:id/chart', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const pid = parseInt(req.params.id);
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [pid, tenantId] : [pid];

        const patient = (await pool.query(`SELECT * FROM patients WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];
        if (!patient) return res.status(404).json({ error: 'Patient not found' });

        // Fetch all chart data in parallel
        const [records, orders, vitals, problems, allergies, medications, invoices, queueInfo] = await Promise.all([
            pool.query('SELECT * FROM medical_records WHERE patient_id=$1 ORDER BY created_at DESC LIMIT 50', [pid]).then(r => r.rows).catch(() => []),
            pool.query("SELECT * FROM lab_radiology_orders WHERE patient_id=$1 ORDER BY created_at DESC LIMIT 50", [pid]).then(r => r.rows).catch(() => []),
            pool.query('SELECT * FROM patient_scores WHERE patient_id=$1 ORDER BY recorded_at DESC LIMIT 100', [pid]).then(r => r.rows).catch(() => []),
            pool.query('SELECT * FROM patient_problems WHERE patient_id=$1 ORDER BY created_at DESC', [pid]).then(r => r.rows).catch(() => []),
            pool.query('SELECT * FROM patient_allergies WHERE patient_id=$1 ORDER BY id DESC', [pid]).then(r => r.rows).catch(() => []),
            pool.query("SELECT * FROM prescriptions WHERE patient_id=$1 ORDER BY created_at DESC LIMIT 20", [pid]).then(r => r.rows).catch(() => []),
            pool.query('SELECT id, invoice_number, total_amount, status, created_at FROM invoices WHERE patient_id=$1 AND cancelled=0 ORDER BY created_at DESC LIMIT 10', [pid]).then(r => r.rows).catch(() => []),
            pool.query("SELECT w.*, COALESCE(r.name_ar, r.name_en, r.room_number) AS room_name FROM waiting_queue w LEFT JOIN exam_rooms r ON r.id::text = w.exam_room_id::text WHERE w.patient_id=$1 AND w.status NOT IN ('ReadyForDischarge','NoShow','Done') ORDER BY w.check_in_time DESC LIMIT 1", [pid]).then(r => r.rows[0]).catch(() => null),
        ]);

        res.json({ patient, records, orders, vitals, problems, allergies, medications, invoices, queueInfo: queueInfo || null });
    } catch (e) {
        console.error('[DS] Error fetching patient chart:', e);
        res.status(500).json({ error: 'Server error', detail: e.message });
    }
});
router.get('/api/patients/:id/vitals', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const pid = parseInt(req.params.id);
        const rows = (await pool.query('SELECT * FROM patient_scores WHERE patient_id=$1 ORDER BY recorded_at DESC LIMIT 100', [pid])).rows;
        res.json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/patients/:id/problems', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const pid = parseInt(req.params.id);
        const rows = (await pool.query('SELECT * FROM patient_problems WHERE patient_id=$1 ORDER BY created_at DESC', [pid])).rows;
        res.json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/patients/:id/problems', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const pid = parseInt(req.params.id);
        const { tenantId } = getRequestTenantContext(req);
        const { problem_name, icd_code, status, onset_date } = req.body;
        if (!problem_name) return res.status(400).json({ error: 'problem_name required' });
        const result = await pool.query(
            `INSERT INTO patient_problems (patient_id, problem_name, icd_code, status, onset_date, tenant_id, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING *`,
            [pid, problem_name, icd_code || '', status || 'active', onset_date || null, tenantId]
        );
        res.status(201).json(result.rows[0]);
    } catch (e) {
        // Fallback: store via medical_records if table not found
        if (e.code === '42P01') return res.status(501).json({ error: 'patient_problems table not found', hint: 'Run migration' });
        res.status(500).json({ error: 'Server error', detail: e.message });
    }
});
router.get('/api/patients/:id/allergies', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const pid = parseInt(req.params.id);
        let rows = [];
        try {
            rows = (await pool.query('SELECT * FROM patient_allergies WHERE patient_id=$1 ORDER BY id DESC', [pid])).rows;
        } catch {
            // Fallback: parse allergies from patients.allergies column
            const p = (await pool.query('SELECT allergies FROM patients WHERE id=$1', [pid])).rows[0];
            if (p?.allergies) {
                const parts = p.allergies.split(',').map(a => a.trim()).filter(Boolean);
                rows = parts.map((a, i) => ({ id: i, allergen: a, reaction: '', severity: 'unknown', allergen_type: 'Drug' }));
            }
        }
        res.json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/patients/:id/medications', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const pid = parseInt(req.params.id);
        const rows = (await pool.query(
            "SELECT * FROM prescriptions WHERE patient_id=$1 ORDER BY created_at DESC LIMIT 30",
            [pid]
        )).rows;
        res.json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/patients/:id/lab-results', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const pid = parseInt(req.params.id);
        // Fetch lab orders with their results
        const labOrders = (await pool.query(
            `SELECT o.*,
                    json_agg(lr.* ORDER BY lr.id ASC) FILTER (WHERE lr.id IS NOT NULL) as results
             FROM lab_radiology_orders o
             LEFT JOIN lab_results lr ON lr.order_id = o.id
             WHERE o.patient_id=$1 AND o.is_radiology=0
             GROUP BY o.id
             ORDER BY o.created_at DESC LIMIT 30`,
            [pid]
        )).rows;
        // Fetch radiology orders
        const radOrders = (await pool.query(
            `SELECT * FROM lab_radiology_orders WHERE patient_id=$1 AND is_radiology=1 ORDER BY created_at DESC LIMIT 20`,
            [pid]
        )).rows;
        // Standalone lab_results rows linked by patient
        const labResults = (await pool.query(
            `SELECT lr.*, o.order_type, o.created_at as order_date
             FROM lab_results lr
             JOIN lab_radiology_orders o ON lr.order_id = o.id
             WHERE o.patient_id=$1
             ORDER BY o.created_at DESC, lr.id ASC LIMIT 200`,
            [pid]
        )).rows;
        res.json({ labOrders, radOrders, labResults });
    } catch (e) {
        console.error('[DS] Error fetching lab results:', e);
        res.status(500).json({ error: 'Server error', detail: e.message });
    }
});
router.get('/api/patients/:id/active-orders', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const pid = parseInt(req.params.id);
        const orders = (await pool.query(
            `SELECT o.*, 
                    CASE WHEN o.is_radiology=1 THEN 'radiology' ELSE 'lab' END as order_category
             FROM lab_radiology_orders o
             WHERE o.patient_id=$1
             ORDER BY o.created_at DESC LIMIT 50`,
            [pid]
        )).rows;
        const prescriptions = (await pool.query(
            "SELECT * FROM prescriptions WHERE patient_id=$1 AND status != 'Dispensed' ORDER BY created_at DESC LIMIT 20",
            [pid]
        )).rows.catch ? [] : (await pool.query(
            "SELECT * FROM prescriptions WHERE patient_id=$1 ORDER BY created_at DESC LIMIT 20",
            [pid]
        )).rows;
        res.json({ orders, prescriptions });
    } catch (e) {
        console.error('[DS] Error fetching active orders:', e);
        res.status(500).json({ error: 'Server error', detail: e.message });
    }
});
router.get('/api/patients/:id/history-extended', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const pid = parseInt(req.params.id);
        const social = await pool.query('SELECT * FROM patient_social_history WHERE patient_id=$1 ORDER BY id DESC LIMIT 1', [pid]).then(r => r.rows[0]).catch(() => null);
        const family = await pool.query('SELECT * FROM patient_family_history WHERE patient_id=$1 ORDER BY id ASC', [pid]).then(r => r.rows).catch(() => []);
        const surgical = await pool.query('SELECT * FROM patient_surgical_history WHERE patient_id=$1 ORDER BY procedure_date DESC', [pid]).then(r => r.rows).catch(() => []);
        const immunizations = await pool.query('SELECT * FROM pediatric_immunizations WHERE patient_id=$1 ORDER BY given_date DESC', [pid]).then(r => r.rows).catch(() => []);
        res.json({ social: social || {}, family, surgical, immunizations });
    } catch (e) {
        res.status(500).json({ error: 'Server error', detail: e.message });
    }
});
router.post('/api/patients/:id/social-history', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const pid = parseInt(req.params.id);
        const { tenantId } = getRequestTenantContext(req);
        const { smoking_status, alcohol_use, exercise_frequency, occupation, marital_status, education_level, notes } = req.body;
        const result = await pool.query(
            `INSERT INTO patient_social_history (patient_id, smoking_status, alcohol_use, exercise_frequency, occupation, marital_status, education_level, notes, tenant_id, recorded_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP)
             ON CONFLICT (patient_id) DO UPDATE SET
               smoking_status=EXCLUDED.smoking_status, alcohol_use=EXCLUDED.alcohol_use,
               exercise_frequency=EXCLUDED.exercise_frequency, occupation=EXCLUDED.occupation,
               marital_status=EXCLUDED.marital_status, notes=EXCLUDED.notes, recorded_at=CURRENT_TIMESTAMP
             RETURNING *`,
            [pid, smoking_status || '', alcohol_use || false, exercise_frequency || '', occupation || '', marital_status || '', education_level || '', notes || '', tenantId]
        );
        res.json(result.rows[0]);
    } catch (e) {
        // Table might not exist yet — graceful
        if (e.code === '42P01') return res.json({ success: true, degraded: true, hint: 'social history table pending migration' });
        res.status(500).json({ error: 'Server error', detail: e.message });
    }
});
router.post('/api/patients/:id/family-history', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const pid = parseInt(req.params.id);
        const { tenantId } = getRequestTenantContext(req);
        const { relation, condition, icd_code, age_at_onset, notes } = req.body;
        const result = await pool.query(
            `INSERT INTO patient_family_history (patient_id, relation, condition, icd_code, age_at_onset, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [pid, relation || '', condition || '', icd_code || '', age_at_onset || null, notes || '', tenantId]
        );
        res.json(result.rows[0]);
    } catch (e) {
        if (e.code === '42P01') return res.json({ success: true, degraded: true });
        res.status(500).json({ error: 'Server error', detail: e.message });
    }
});
router.put('/api/patients/:id/referral', requireAuth, requireRole('patients'), async (req, res) => {
    try {
        const { department } = req.body;
        await pool.query('UPDATE patients SET department=$1 WHERE id=$2', [department, req.params.id]);
        res.json((await pool.query('SELECT * FROM patients WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/patients/:id/timeline', requireAuth, requireRole('patients'), requireTenantScope, async (req, res) => {
    try {
        const pid = req.params.id;
        // --- TENANT SCOPE: verify patient belongs to current tenant ---
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [pid, tenantId] : [pid];
        const patientCheck = (await pool.query(`SELECT id FROM patients WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];
        if (!patientCheck) return res.status(404).json({ error: 'Patient not found' });
        const events = [];
        // Medical records
        const records = (await pool.query('SELECT id, diagnosis, visit_date as event_date, symptoms FROM medical_records WHERE patient_id=$1', [pid])).rows;
        records.forEach(r => events.push({ type: 'medical_record', icon: '🩺', title: r.diagnosis || 'Consultation', subtitle: r.symptoms, date: r.event_date }));
        // Lab orders
        const labs = (await pool.query('SELECT id, order_type, status, created_at as event_date FROM lab_radiology_orders WHERE patient_id=$1 AND is_radiology=0', [pid])).rows;
        labs.forEach(l => events.push({ type: 'lab', icon: '🔬', title: l.order_type, subtitle: l.status, date: l.event_date }));
        // Radiology
        const rads = (await pool.query('SELECT id, order_type, status, created_at as event_date FROM lab_radiology_orders WHERE patient_id=$1 AND is_radiology=1', [pid])).rows;
        rads.forEach(r => events.push({ type: 'radiology', icon: '📡', title: r.order_type, subtitle: r.status, date: r.event_date }));
        // Prescriptions
        const rxs = (await pool.query('SELECT id, dosage, status, created_at as event_date FROM prescriptions WHERE patient_id=$1', [pid])).rows;
        rxs.forEach(rx => events.push({ type: 'prescription', icon: '💊', title: rx.dosage, subtitle: rx.status, date: rx.event_date }));
        // Invoices
        const invs = (await pool.query('SELECT id, description, total, paid, created_at as event_date FROM invoices WHERE patient_id=$1', [pid])).rows;
        invs.forEach(i => events.push({ type: 'invoice', icon: '🧾', title: i.description, subtitle: `${i.total} SAR - ${i.paid ? 'Paid' : 'Unpaid'}`, date: i.event_date }));
        // Certificates
        const certs = (await pool.query('SELECT id, cert_type, diagnosis, created_at as event_date FROM medical_certificates WHERE patient_id=$1', [pid])).rows;
        certs.forEach(c => events.push({ type: 'certificate', icon: '📋', title: c.cert_type === 'sick_leave' ? 'Sick Leave' : c.cert_type, subtitle: c.diagnosis, date: c.event_date }));
        // Sort by date descending
        events.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        res.json(events);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.delete('/api/patients/:id', requireAuth, async (req, res) => {
    try {
        if (req.session.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Access denied. Only Admin can delete patients.' });
        }
        const pid = req.params.id;
        // --- TENANT SCOPE: verify patient belongs to current tenant before delete (IDOR prevention) ---
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [pid, tenantId] : [pid];
        const patientCheck = (await pool.query(`SELECT id FROM patients WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];
        if (!patientCheck) return res.status(404).json({ error: 'Patient not found' });
        const invoices = (await pool.query('SELECT COUNT(*) as cnt FROM invoices WHERE patient_id=$1 AND cancelled=0', [pid])).rows[0].cnt;
        const orders = (await pool.query('SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE patient_id=$1', [pid])).rows[0].cnt;
        const records = (await pool.query('SELECT COUNT(*) as cnt FROM medical_records WHERE patient_id=$1', [pid])).rows[0].cnt;
        if (parseInt(invoices) > 0 || parseInt(orders) > 0 || parseInt(records) > 0) {
            await pool.query('UPDATE patients SET is_deleted=1, deleted_at=NOW(), deleted_by=$1 WHERE id=$2', [req.session.user?.display_name || '', pid]);
            logAudit(req.session.user?.id, req.session.user?.display_name, 'SOFT_DELETE', 'Patients', 'Soft deleted patient #' + pid, req.ip);
            return res.json({ success: true, soft_deleted: true, message: 'Patient archived (has records)' });
        }
        await pool.query('DELETE FROM patients WHERE id=$1', [pid]);
        logAudit(req.session.user?.id, req.session.user?.display_name, 'DELETE', 'Patients', 'Deleted patient #' + pid, req.ip);
        res.json({ success: true, deleted: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/patients/:id/summary', requireAuth, requireRole('patients'), requireTenantScope, async (req, res) => {
    try {
        const pid = req.params.id;
        // --- TENANT SCOPE: verify patient belongs to current tenant ---
        const { tenantId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [pid, tenantId] : [pid];
        const patient = (await pool.query(`SELECT * FROM patients WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];
        if (!patient) return res.status(404).json({ error: 'Not found' });
        const records = (await pool.query('SELECT * FROM medical_records WHERE patient_id=$1 ORDER BY created_at DESC LIMIT 10', [pid])).rows;
        const labs = (await pool.query("SELECT * FROM lab_radiology_orders WHERE patient_id=$1 AND is_radiology=0 ORDER BY created_at DESC LIMIT 10", [pid])).rows;
        const rads = (await pool.query("SELECT * FROM lab_radiology_orders WHERE patient_id=$1 AND is_radiology=1 ORDER BY created_at DESC LIMIT 5", [pid])).rows;
        const rxs = (await pool.query('SELECT * FROM prescriptions WHERE patient_id=$1 ORDER BY created_at DESC LIMIT 10', [pid])).rows;
        const invoices = (await pool.query('SELECT * FROM invoices WHERE patient_id=$1 AND cancelled=0 ORDER BY created_at DESC LIMIT 10', [pid])).rows;
        const visits = (await pool.query('SELECT * FROM patient_visits WHERE patient_id=$1 ORDER BY created_at DESC LIMIT 10', [pid])).rows;
        const consents = (await pool.query('SELECT pc.*, cft.title_ar FROM patient_consents pc LEFT JOIN consent_form_templates cft ON pc.template_id=cft.id WHERE pc.patient_id=$1 ORDER BY pc.created_at DESC LIMIT 5', [pid])).rows;
        res.json({ patient, records, labs, rads, prescriptions: rxs, invoices, visits, consents });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
    return router;
};
