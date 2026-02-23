const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { pool, initDatabase } = require('./db_postgres');
const { insertSampleData, populateLabCatalog, populateRadiologyCatalog } = require('./seed_data_pg');
const { populateMedicalServices, populateBaseDrugs } = require('./seed_services_pg');

// Multer setup for radiology image uploads
const uploadsDir = path.join(__dirname, 'public', 'uploads', 'radiology');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadsDir),
        filename: (req, file, cb) => cb(null, `rad_${req.params.id}_${Date.now()}${path.extname(file.originalname)}`)
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|bmp|webp|dicom|dcm/;
        cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
    }
});

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'nama-medical-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Auth middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.user) return next();
    res.status(401).json({ error: 'Unauthorized' });
}

// ===== AUTH ROUTES =====
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
        const { rows } = await pool.query('SELECT id, display_name, role, speciality, permissions FROM system_users WHERE username=$1 AND password_hash=$2 AND is_active=1', [username, password]);
        if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
        const user = rows[0];
        req.session.user = { id: user.id, name: user.display_name, role: user.role, speciality: user.speciality || '', permissions: user.permissions || '' };
        res.json({ success: true, user: req.session.user });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
    if (req.session && req.session.user) return res.json({ user: req.session.user });
    res.status(401).json({ error: 'Not logged in' });
});

// ===== VAT HELPER =====
async function calcVAT(patientId) {
    if (!patientId) return { rate: 0, vatAmount: 0, applyVAT: false };
    const p = (await pool.query('SELECT nationality FROM patients WHERE id=$1', [patientId])).rows[0];
    const nat = (p && p.nationality) || '';
    const isSaudi = nat === 'سعودي' || nat.toLowerCase() === 'saudi';
    return { rate: isSaudi ? 0 : 0.15, applyVAT: !isSaudi };
}
function addVAT(amount, vatRate) {
    const vat = Math.round(amount * vatRate * 100) / 100;
    return { total: Math.round((amount + vat) * 100) / 100, vatAmount: vat };
}

// ===== DASHBOARD =====
app.get('/api/dashboard/stats', requireAuth, async (req, res) => {
    try {
        const patients = (await pool.query('SELECT COUNT(*) as cnt FROM patients')).rows[0].cnt;
        const revenue = (await pool.query('SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=1')).rows[0].total;
        const waiting = (await pool.query("SELECT COUNT(*) as cnt FROM patients WHERE status='Waiting'")).rows[0].cnt;
        const pendingClaims = (await pool.query("SELECT COUNT(*) as cnt FROM insurance_claims WHERE status='Pending'")).rows[0].cnt;
        const todayAppts = (await pool.query("SELECT COUNT(*) as cnt FROM appointments WHERE appt_date=CURRENT_DATE::TEXT")).rows[0].cnt;
        const employees = (await pool.query('SELECT COUNT(*) as cnt FROM employees')).rows[0].cnt;
        res.json({ patients, revenue, waiting, pendingClaims, todayAppts, employees });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== PATIENTS =====
app.get('/api/patients', requireAuth, async (req, res) => {
    try {
        const { search } = req.query;
        let rows;
        if (search) {
            const s = `%${search}%`;
            rows = (await pool.query(`SELECT * FROM patients WHERE name_ar LIKE $1 OR name_en LIKE $2 OR national_id LIKE $3 OR phone LIKE $4 OR file_number::TEXT LIKE $5 ORDER BY id DESC`, [s, s, s, s, s])).rows;
        } else {
            rows = (await pool.query('SELECT * FROM patients ORDER BY id DESC')).rows;
        }
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/patients', requireAuth, async (req, res) => {
    try {
        const { name_ar, name_en, national_id, nationality, phone, department, amount, payment_method, dob, dob_hijri } = req.body;
        const maxFile = (await pool.query('SELECT COALESCE(MAX(file_number), 1000) as mf FROM patients')).rows[0].mf;
        let age = 0;
        if (dob) {
            const bd = new Date(dob);
            const ageDifMs = Date.now() - bd.getTime();
            const ageDate = new Date(ageDifMs);
            age = Math.abs(ageDate.getUTCFullYear() - 1970);
        }
        const fileOpenFee = parseFloat(amount) || 0;
        const result = await pool.query('INSERT INTO patients (file_number, name_ar, name_en, national_id, nationality, phone, department, amount, payment_method, dob, dob_hijri, age) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id',
            [maxFile + 1, name_ar || '', name_en || '', national_id || '', nationality || '', phone || '', department || '', fileOpenFee, payment_method || '', dob || '', dob_hijri || '', age || 0]);
        const patient = (await pool.query('SELECT * FROM patients WHERE id=$1', [result.rows[0].id])).rows[0];
        // Auto-create invoice for file opening fee (with VAT for non-Saudis)
        if (fileOpenFee > 0) {
            const vat = await calcVAT(patient.id);
            const { total: finalTotal, vatAmount } = addVAT(fileOpenFee, vat.rate);
            const desc = vat.applyVAT ? `فتح ملف / File Opening Fee (+ ضريبة ${vatAmount} SAR)` : 'فتح ملف / File Opening Fee';
            await pool.query('INSERT INTO invoices (patient_id, patient_name, total, vat_amount, description, service_type, paid, payment_method) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
                [patient.id, name_en || name_ar, finalTotal, vatAmount, desc, 'File Opening', payment_method === 'كاش' || payment_method === 'Cash' ? 1 : 0, payment_method || '']);
        }
        res.json(patient);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/patients/:id', requireAuth, async (req, res) => {
    try {
        const { department, status } = req.body;
        if (department !== undefined) await pool.query('UPDATE patients SET department=$1 WHERE id=$2', [department, req.params.id]);
        if (status !== undefined) await pool.query('UPDATE patients SET status=$1 WHERE id=$2', [status, req.params.id]);
        const patient = (await pool.query('SELECT * FROM patients WHERE id=$1', [req.params.id])).rows[0];
        res.json(patient);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/patients/:id', requireAuth, async (req, res) => {
    try {
        const id = req.params.id;
        await pool.query('DELETE FROM medical_records WHERE patient_id=$1', [id]);
        await pool.query('DELETE FROM lab_radiology_orders WHERE patient_id=$1', [id]);
        await pool.query('DELETE FROM prescriptions WHERE patient_id=$1', [id]);
        await pool.query('DELETE FROM dental_records WHERE patient_id=$1', [id]);
        await pool.query('DELETE FROM appointments WHERE patient_id=$1', [id]);
        await pool.query('DELETE FROM approvals WHERE patient_id=$1', [id]);
        await pool.query('DELETE FROM patients WHERE id=$1', [id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== NURSING =====
app.get('/api/nursing/vitals', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM nursing_vitals ORDER BY id DESC LIMIT 100')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/nursing/vitals/:patientId', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM nursing_vitals WHERE patient_id=$1 ORDER BY id DESC LIMIT 1', [req.params.patientId])).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/nursing/vitals', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, bp, temp, weight, height, pulse, o2_sat, respiratory_rate, blood_sugar, chronic_diseases, current_medications, allergies, notes } = req.body;
        await pool.query('INSERT INTO nursing_vitals (patient_id, patient_name, bp, temp, weight, height, pulse, o2_sat, respiratory_rate, blood_sugar, chronic_diseases, current_medications, allergies, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',
            [patient_id, patient_name || '', bp || '', temp || 0, weight || 0, height || 0, pulse || 0, o2_sat || 0, respiratory_rate || 0, blood_sugar || 0, chronic_diseases || '', current_medications || '', allergies || '', notes || '']);
        await pool.query('UPDATE patients SET status=$1 WHERE id=$2', ['Waiting', patient_id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== APPOINTMENTS =====
app.get('/api/appointments', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM appointments ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/appointments', requireAuth, async (req, res) => {
    try {
        const { patient_name, patient_id, doctor_name, department, appt_date, appt_time, notes, fee } = req.body;
        const apptFee = parseFloat(fee) || 0;
        const result = await pool.query('INSERT INTO appointments (patient_id, patient_name, doctor_name, department, appt_date, appt_time, notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
            [patient_id || null, patient_name, doctor_name, department, appt_date, appt_time, notes || '']);
        // Auto-create invoice for appointment fee
        if (apptFee > 0 && patient_id) {
            await pool.query('INSERT INTO invoices (patient_id, patient_name, total, description, service_type, paid) VALUES ($1,$2,$3,$4,$5,0)',
                [patient_id, patient_name, apptFee, `رسوم موعد: ${doctor_name} - ${appt_date}`, 'Appointment']);
        }
        const appt = (await pool.query('SELECT * FROM appointments WHERE id=$1', [result.rows[0].id])).rows[0];
        res.json(appt);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/appointments/:id', requireAuth, async (req, res) => {
    try { await pool.query('DELETE FROM appointments WHERE id=$1', [req.params.id]); res.json({ success: true }); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== EMPLOYEES =====
app.get('/api/employees', requireAuth, async (req, res) => {
    try {
        const { role } = req.query;
        if (role) { res.json((await pool.query('SELECT * FROM employees WHERE role LIKE $1 ORDER BY name', [`%${role}%`])).rows); }
        else { res.json((await pool.query('SELECT * FROM employees ORDER BY id DESC')).rows); }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/employees', requireAuth, async (req, res) => {
    try {
        const { name, name_ar, name_en, role, department_ar, department_en, salary, commission_type, commission_value } = req.body;
        const result = await pool.query('INSERT INTO employees (name, name_ar, name_en, role, department_ar, department_en, salary, commission_type, commission_value) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id',
            [name || name_en, name_ar || '', name_en || '', role || 'Staff', department_ar || '', department_en || '', salary || 0, commission_type || 'percentage', parseFloat(commission_value) || 0]);
        res.json((await pool.query('SELECT * FROM employees WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/employees/:id', requireAuth, async (req, res) => {
    try { await pool.query('DELETE FROM employees WHERE id=$1', [req.params.id]); res.json({ success: true }); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== INVOICES =====
app.get('/api/invoices', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM invoices ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/invoices', requireAuth, async (req, res) => {
    try {
        const { patient_name, total, description, service_type } = req.body;
        const result = await pool.query('INSERT INTO invoices (patient_name, total, description, service_type) VALUES ($1,$2,$3,$4) RETURNING id',
            [patient_name, total || 0, description || '', service_type || '']);
        res.json((await pool.query('SELECT * FROM invoices WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== INSURANCE =====
app.get('/api/insurance/companies', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM insurance_companies ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/insurance/companies', requireAuth, async (req, res) => {
    try {
        const { name_ar, name_en, contact_info } = req.body;
        const result = await pool.query('INSERT INTO insurance_companies (name_ar, name_en, contact_info) VALUES ($1,$2,$3) RETURNING id',
            [name_ar || '', name_en || '', contact_info || '']);
        res.json((await pool.query('SELECT * FROM insurance_companies WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/insurance/claims', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM insurance_claims ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/insurance/claims', requireAuth, async (req, res) => {
    try {
        const { patient_name, insurance_company, claim_amount } = req.body;
        const result = await pool.query('INSERT INTO insurance_claims (patient_name, insurance_company, claim_amount) VALUES ($1,$2,$3) RETURNING id',
            [patient_name, insurance_company, claim_amount || 0]);
        res.json((await pool.query('SELECT * FROM insurance_claims WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/insurance/claims/:id', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        if (status) await pool.query('UPDATE insurance_claims SET status=$1 WHERE id=$2', [status, req.params.id]);
        res.json((await pool.query('SELECT * FROM insurance_claims WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/medical/records', requireAuth, async (req, res) => {
    try {
        const { patient_id } = req.query;
        if (patient_id) {
            res.json((await pool.query('SELECT mr.*, p.name_en as patient_name FROM medical_records mr LEFT JOIN patients p ON mr.patient_id=p.id WHERE mr.patient_id=$1 ORDER BY mr.id DESC', [patient_id])).rows);
        } else {
            res.json((await pool.query('SELECT mr.*, p.name_en as patient_name FROM medical_records mr LEFT JOIN patients p ON mr.patient_id=p.id ORDER BY mr.id DESC')).rows);
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/medical/records', requireAuth, async (req, res) => {
    try {
        const { patient_id, doctor_id, diagnosis, symptoms, icd10_codes, notes } = req.body;
        const result = await pool.query('INSERT INTO medical_records (patient_id, doctor_id, diagnosis, symptoms, icd10_codes, notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
            [patient_id, doctor_id || 0, diagnosis || '', symptoms || '', icd10_codes || '', notes || '']);
        res.json((await pool.query('SELECT * FROM medical_records WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== MEDICAL SERVICES =====
app.get('/api/medical/services', requireAuth, async (req, res) => {
    try {
        const { specialty } = req.query;
        if (specialty) { res.json((await pool.query('SELECT * FROM medical_services WHERE specialty=$1 ORDER BY category, name_en', [specialty])).rows); }
        else { res.json((await pool.query('SELECT * FROM medical_services ORDER BY specialty, category, name_en')).rows); }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/medical/services/:id', requireAuth, async (req, res) => {
    try {
        const { price } = req.body;
        if (price !== undefined) await pool.query('UPDATE medical_services SET price=$1 WHERE id=$2', [price, req.params.id]);
        res.json((await pool.query('SELECT * FROM medical_services WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== DOCTOR PROCEDURE BILLING =====
app.post('/api/medical/bill-procedures', requireAuth, async (req, res) => {
    try {
        const { patient_id, services } = req.body;
        if (!patient_id || !services || !services.length) return res.status(400).json({ error: 'Missing patient or services' });
        const p = (await pool.query('SELECT name_en, name_ar FROM patients WHERE id=$1', [patient_id])).rows[0];
        if (!p) return res.status(404).json({ error: 'Patient not found' });
        let totalBilled = 0;
        const descriptions = [];
        for (const svc of services) {
            totalBilled += parseFloat(svc.price) || 0;
            descriptions.push(`${svc.nameEn || svc.nameAr} (${svc.price} SAR)`);
        }
        if (totalBilled > 0) {
            const vat = await calcVAT(patient_id);
            const { total: finalTotal, vatAmount } = addVAT(totalBilled, vat.rate);
            const desc = descriptions.join(' | ') + (vat.applyVAT ? ` (+ ضريبة ${vatAmount} SAR)` : '');
            await pool.query('INSERT INTO invoices (patient_id, patient_name, total, vat_amount, description, service_type, paid) VALUES ($1,$2,$3,$4,$5,$6,0)',
                [patient_id, p.name_en || p.name_ar, finalTotal, vatAmount, desc, 'Consultation']);
        }
        res.json({ success: true, totalBilled, invoiceCount: 1 });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== DEPARTMENT RESOURCE REQUESTS =====
app.get('/api/dept-requests', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM inventory_dept_requests ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/dept-requests', requireAuth, async (req, res) => {
    try {
        const { department, requested_by, items, notes } = req.body;
        const result = await pool.query('INSERT INTO inventory_dept_requests (department, requested_by, request_date, notes) VALUES ($1,$2,CURRENT_DATE::TEXT,$3) RETURNING id',
            [department || '', requested_by || req.session.user.name || '', notes || '']);
        const reqId = result.rows[0].id;
        if (items && items.length) {
            for (const item of items) {
                await pool.query('INSERT INTO inventory_dept_request_items (request_id, item_id, qty_requested) VALUES ($1,$2,$3)',
                    [reqId, item.item_id || 0, item.qty || 1]);
            }
        }
        res.json((await pool.query('SELECT * FROM inventory_dept_requests WHERE id=$1', [reqId])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/dept-requests/:id/items', requireAuth, async (req, res) => {
    try {
        res.json((await pool.query('SELECT dri.*, ii.item_name FROM inventory_dept_request_items dri LEFT JOIN inventory_items ii ON dri.item_id=ii.id WHERE dri.request_id=$1', [req.params.id])).rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/dept-requests/:id', requireAuth, async (req, res) => {
    try {
        const { status, approved_by } = req.body;
        if (status) {
            await pool.query('UPDATE inventory_dept_requests SET status=$1, approved_by=$2 WHERE id=$3', [status, approved_by || req.session.user.name, req.params.id]);
            // If approved, deduct from inventory
            if (status === 'Approved') {
                const items = (await pool.query('SELECT * FROM inventory_dept_request_items WHERE request_id=$1', [req.params.id])).rows;
                for (const item of items) {
                    const approved = item.qty_approved || item.qty_requested;
                    await pool.query('UPDATE inventory_items SET stock_qty = GREATEST(stock_qty - $1, 0) WHERE id=$2', [approved, item.item_id]);
                }
            }
        }
        res.json((await pool.query('SELECT * FROM inventory_dept_requests WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== BILLING SUMMARY =====
app.get('/api/billing/summary/:patient_id', requireAuth, async (req, res) => {
    try {
        const pid = req.params.patient_id;
        const invoices = (await pool.query('SELECT * FROM invoices WHERE patient_id=$1 ORDER BY id DESC', [pid])).rows;
        const byType = {};
        invoices.forEach(inv => {
            const t = inv.service_type || 'Other';
            if (!byType[t]) byType[t] = { count: 0, total: 0, paid: 0 };
            byType[t].count++;
            byType[t].total += parseFloat(inv.total) || 0;
            if (inv.paid) byType[t].paid += parseFloat(inv.total) || 0;
        });
        const totalBilled = invoices.reduce((s, i) => s + (parseFloat(i.total) || 0), 0);
        const totalPaid = invoices.filter(i => i.paid).reduce((s, i) => s + (parseFloat(i.total) || 0), 0);
        res.json({ invoices, byType, totalBilled, totalPaid, balance: totalBilled - totalPaid });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== CATALOG APIs =====
app.get('/api/catalog/lab', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM lab_tests_catalog ORDER BY category, test_name')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/catalog/lab/:id', requireAuth, async (req, res) => {
    try {
        const { price } = req.body;
        if (price !== undefined) await pool.query('UPDATE lab_tests_catalog SET price=$1 WHERE id=$2', [price, req.params.id]);
        res.json((await pool.query('SELECT * FROM lab_tests_catalog WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/catalog/radiology', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM radiology_catalog ORDER BY modality, exact_name')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/catalog/radiology/:id', requireAuth, async (req, res) => {
    try {
        const { price } = req.body;
        if (price !== undefined) await pool.query('UPDATE radiology_catalog SET price=$1 WHERE id=$2', [price, req.params.id]);
        res.json((await pool.query('SELECT * FROM radiology_catalog WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== LAB =====
app.get('/api/lab/orders', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT lo.*, p.name_en as patient_name FROM lab_radiology_orders lo LEFT JOIN patients p ON lo.patient_id=p.id WHERE lo.is_radiology=0 ORDER BY lo.id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/lab/orders', requireAuth, async (req, res) => {
    try {
        const { patient_id, doctor_id, order_type, description, price } = req.body;
        // Auto-lookup price from lab catalog if not provided
        let labPrice = parseFloat(price) || 0;
        if (!labPrice && order_type) {
            const catalogMatch = (await pool.query('SELECT price FROM lab_tests_catalog WHERE test_name ILIKE $1 LIMIT 1', [`%${order_type}%`])).rows[0];
            if (catalogMatch) labPrice = catalogMatch.price;
        }
        const result = await pool.query('INSERT INTO lab_radiology_orders (patient_id, doctor_id, order_type, description, is_radiology, price) VALUES ($1,$2,$3,$4,0,$5) RETURNING id',
            [patient_id, doctor_id || 0, order_type || '', description || '', labPrice]);
        // Auto-create invoice for lab test (with VAT for non-Saudis)
        if (labPrice > 0 && patient_id) {
            const p = (await pool.query('SELECT name_en, name_ar FROM patients WHERE id=$1', [patient_id])).rows[0];
            const vat = await calcVAT(patient_id);
            const { total: finalTotal, vatAmount } = addVAT(labPrice, vat.rate);
            const desc = `فحص مختبر: ${order_type}` + (vat.applyVAT ? ` (+ ضريبة ${vatAmount} SAR)` : '');
            await pool.query('INSERT INTO invoices (patient_id, patient_name, total, vat_amount, description, service_type, paid) VALUES ($1,$2,$3,$4,$5,$6,0)',
                [patient_id, p?.name_en || p?.name_ar || '', finalTotal, vatAmount, desc, 'Lab Test']);
        }
        res.json((await pool.query('SELECT * FROM lab_radiology_orders WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/lab/catalog', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM lab_tests_catalog ORDER BY id')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/lab/orders/:id', requireAuth, async (req, res) => {
    try {
        const { status, result: testResult } = req.body;
        if (status) await pool.query('UPDATE lab_radiology_orders SET status=$1 WHERE id=$2', [status, req.params.id]);
        if (testResult) await pool.query('UPDATE lab_radiology_orders SET results=$1 WHERE id=$2', [testResult, req.params.id]);
        res.json((await pool.query('SELECT * FROM lab_radiology_orders WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== RADIOLOGY =====
app.get('/api/radiology/orders', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT lo.*, p.name_en as patient_name FROM lab_radiology_orders lo LEFT JOIN patients p ON lo.patient_id=p.id WHERE lo.is_radiology=1 ORDER BY lo.id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/radiology/catalog', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM radiology_catalog ORDER BY id')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/radiology/orders/:id', requireAuth, async (req, res) => {
    try {
        const { status, result: testResult } = req.body;
        if (status) await pool.query('UPDATE lab_radiology_orders SET status=$1 WHERE id=$2', [status, req.params.id]);
        if (testResult) await pool.query('UPDATE lab_radiology_orders SET results=$1 WHERE id=$2', [testResult, req.params.id]);
        res.json((await pool.query('SELECT * FROM lab_radiology_orders WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/radiology/orders', requireAuth, async (req, res) => {
    try {
        const { patient_id, doctor_id, order_type, description, price } = req.body;
        // Auto-lookup price from radiology catalog if not provided
        let radPrice = parseFloat(price) || 0;
        if (!radPrice && order_type) {
            const catalogMatch = (await pool.query('SELECT price FROM radiology_catalog WHERE exact_name ILIKE $1 LIMIT 1', [`%${order_type}%`])).rows[0];
            if (catalogMatch) radPrice = catalogMatch.price;
        }
        const result = await pool.query('INSERT INTO lab_radiology_orders (patient_id, doctor_id, order_type, description, is_radiology, price) VALUES ($1,$2,$3,$4,1,$5) RETURNING id',
            [patient_id, doctor_id || 0, order_type || '', description || '', radPrice]);
        // Auto-create invoice for radiology (with VAT for non-Saudis)
        if (radPrice > 0 && patient_id) {
            const p = (await pool.query('SELECT name_en, name_ar FROM patients WHERE id=$1', [patient_id])).rows[0];
            const vat = await calcVAT(patient_id);
            const { total: finalTotal, vatAmount } = addVAT(radPrice, vat.rate);
            const desc = `أشعة: ${order_type}` + (vat.applyVAT ? ` (+ ضريبة ${vatAmount} SAR)` : '');
            await pool.query('INSERT INTO invoices (patient_id, patient_name, total, vat_amount, description, service_type, paid) VALUES ($1,$2,$3,$4,$5,$6,0)',
                [patient_id, p?.name_en || p?.name_ar || '', finalTotal, vatAmount, desc, 'Radiology']);
        }
        res.json((await pool.query('SELECT * FROM lab_radiology_orders WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/radiology/orders/:id/upload', requireAuth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const orderId = req.params.id;
        const order = (await pool.query('SELECT * FROM lab_radiology_orders WHERE id=$1', [orderId])).rows[0];
        if (!order) return res.status(404).json({ error: 'Order not found' });
        const imagePath = `/uploads/radiology/${req.file.filename}`;
        const existingResults = order.results || '';
        const imageTag = `[IMG:${imagePath}]`;
        const newResults = existingResults ? `${existingResults}\n${imageTag}` : imageTag;
        await pool.query('UPDATE lab_radiology_orders SET results=$1 WHERE id=$2', [newResults, orderId]);
        const updated = (await pool.query('SELECT * FROM lab_radiology_orders WHERE id=$1', [orderId])).rows[0];
        res.json({ success: true, path: imagePath, order: updated });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== PHARMACY =====
app.get('/api/pharmacy/drugs', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM pharmacy_drug_catalog WHERE is_active=1 ORDER BY drug_name')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/pharmacy/drugs', requireAuth, async (req, res) => {
    try {
        const { drug_name, active_ingredient, category, unit, selling_price, cost_price, stock_qty } = req.body;
        const result = await pool.query('INSERT INTO pharmacy_drug_catalog (drug_name, active_ingredient, category, unit, selling_price, cost_price, stock_qty) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
            [drug_name, active_ingredient || '', category || '', unit || '', selling_price || 0, cost_price || 0, stock_qty || 0]);
        res.json((await pool.query('SELECT * FROM pharmacy_drug_catalog WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/pharmacy/queue', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT pq.*, p.name_en as patient_name FROM pharmacy_prescriptions_queue pq LEFT JOIN patients p ON pq.patient_id=p.id ORDER BY pq.id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/pharmacy/queue/:id', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        if (status) await pool.query('UPDATE pharmacy_prescriptions_queue SET status=$1, dispensed_at=CURRENT_TIMESTAMP WHERE id=$2', [status, req.params.id]);
        res.json((await pool.query('SELECT * FROM pharmacy_prescriptions_queue WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== INVENTORY =====
app.get('/api/inventory/items', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM inventory_items WHERE is_active=1 ORDER BY item_name')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/inventory/items', requireAuth, async (req, res) => {
    try {
        const { item_name, item_code, category, unit, cost_price, stock_qty } = req.body;
        const result = await pool.query('INSERT INTO inventory_items (item_name, item_code, category, unit, cost_price, stock_qty) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
            [item_name, item_code || '', category || '', unit || '', cost_price || 0, stock_qty || 0]);
        res.json((await pool.query('SELECT * FROM inventory_items WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== HR =====
app.get('/api/hr/employees', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM hr_employees WHERE is_active=1 ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/hr/employees', requireAuth, async (req, res) => {
    try {
        const { emp_number, name_ar, name_en, national_id, phone, email, department, job_title, hire_date, basic_salary, housing_allowance, transport_allowance } = req.body;
        const result = await pool.query('INSERT INTO hr_employees (emp_number, name_ar, name_en, national_id, phone, email, department, job_title, hire_date, basic_salary, housing_allowance, transport_allowance) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id',
            [emp_number || '', name_ar || '', name_en || '', national_id || '', phone || '', email || '', department || '', job_title || '', hire_date || '', basic_salary || 0, housing_allowance || 0, transport_allowance || 0]);
        res.json((await pool.query('SELECT * FROM hr_employees WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/hr/salaries', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT hs.*, he.name_en as employee_name FROM hr_salaries hs LEFT JOIN hr_employees he ON hs.employee_id=he.id ORDER BY hs.id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/hr/leaves', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT hl.*, he.name_en as employee_name FROM hr_leaves hl LEFT JOIN hr_employees he ON hl.employee_id=he.id ORDER BY hl.id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/hr/attendance', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT ha.*, he.name_en as employee_name FROM hr_attendance ha LEFT JOIN hr_employees he ON ha.employee_id=he.id ORDER BY ha.id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== FINANCE =====
app.get('/api/finance/accounts', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM finance_chart_of_accounts WHERE is_active=1 ORDER BY account_code')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/finance/accounts', requireAuth, async (req, res) => {
    try {
        const { account_code, account_name_ar, account_name_en, parent_id, account_type } = req.body;
        const result = await pool.query('INSERT INTO finance_chart_of_accounts (account_code, account_name_ar, account_name_en, parent_id, account_type) VALUES ($1,$2,$3,$4,$5) RETURNING id',
            [account_code || '', account_name_ar || '', account_name_en || '', parent_id || 0, account_type || '']);
        res.json((await pool.query('SELECT * FROM finance_chart_of_accounts WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/finance/journal', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM finance_journal_entries ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/finance/vouchers', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM finance_vouchers ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== SETTINGS =====
app.get('/api/settings', requireAuth, async (req, res) => {
    try {
        const rows = (await pool.query('SELECT * FROM company_settings')).rows;
        const settings = {};
        rows.forEach(r => settings[r.setting_key] = r.setting_value);
        res.json(settings);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/settings', requireAuth, async (req, res) => {
    try {
        const updates = req.body;
        for (const [key, value] of Object.entries(updates)) {
            await pool.query('INSERT INTO company_settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value=$2', [key, value]);
        }
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/settings/users', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT id, username, display_name, role, speciality, permissions, commission_type, commission_value, is_active, created_at FROM system_users ORDER BY id')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/settings/users', requireAuth, async (req, res) => {
    try {
        const { username, password, display_name, role, speciality, permissions, commission_type, commission_value } = req.body;
        const result = await pool.query('INSERT INTO system_users (username, password_hash, display_name, role, speciality, permissions, commission_type, commission_value) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
            [username, password, display_name || '', role || 'Reception', speciality || '', permissions || '', commission_type || 'percentage', parseFloat(commission_value) || 0]);
        res.json((await pool.query('SELECT id, username, display_name, role, speciality, permissions, commission_type, commission_value, is_active, created_at FROM system_users WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/settings/users/:id', requireAuth, async (req, res) => {
    try {
        const { username, password, display_name, role, speciality, permissions, is_active, commission_type, commission_value } = req.body;
        let query = 'UPDATE system_users SET username=$1, display_name=$2, role=$3, speciality=$4, permissions=$5, is_active=$6, commission_type=$7, commission_value=$8';
        let params = [username, display_name || '', role || 'Reception', speciality || '', permissions || '', is_active === undefined ? 1 : is_active, commission_type || 'percentage', parseFloat(commission_value) || 0];
        let idx = 9;
        if (password && password.trim() !== '') {
            query += `, password_hash=$${idx}`;
            params.push(password);
            idx++;
        }
        query += ` WHERE id=$${idx}`;
        params.push(req.params.id);
        await pool.query(query, params);
        res.json((await pool.query('SELECT id, username, display_name, role, speciality, permissions, commission_type, commission_value, is_active, created_at FROM system_users WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/settings/users/:id', requireAuth, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (userId === req.session.user.id) return res.status(400).json({ error: 'Cannot delete your own account' });
        const userRole = (await pool.query('SELECT role FROM system_users WHERE id=$1', [userId])).rows[0];
        if (userRole && userRole.role === 'Admin') {
            const adminCount = (await pool.query("SELECT COUNT(*) as count FROM system_users WHERE role='Admin'")).rows[0].count;
            if (parseInt(adminCount) <= 1) return res.status(400).json({ error: 'Cannot delete the last admin' });
        }
        await pool.query('DELETE FROM system_users WHERE id=$1', [userId]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== MESSAGING =====
app.get('/api/messages', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;
        res.json((await pool.query('SELECT im.*, su.display_name as sender_name FROM internal_messages im LEFT JOIN system_users su ON im.sender_id=su.id WHERE im.receiver_id=$1 ORDER BY im.id DESC', [userId])).rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/messages', requireAuth, async (req, res) => {
    try {
        const { receiver_id, subject, body, priority } = req.body;
        const result = await pool.query('INSERT INTO internal_messages (sender_id, receiver_id, subject, body, priority) VALUES ($1,$2,$3,$4,$5) RETURNING id',
            [req.session.user.id, receiver_id, subject || '', body || '', priority || 'Normal']);
        res.json((await pool.query('SELECT * FROM internal_messages WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== ONLINE BOOKINGS =====
app.get('/api/bookings', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM online_bookings ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== PRESCRIPTIONS =====
app.get('/api/prescriptions', requireAuth, async (req, res) => {
    try {
        const { patient_id } = req.query;
        if (patient_id) { res.json((await pool.query('SELECT * FROM prescriptions WHERE patient_id=$1 ORDER BY id DESC', [patient_id])).rows); }
        else { res.json((await pool.query('SELECT * FROM prescriptions ORDER BY id DESC')).rows); }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/prescriptions', requireAuth, async (req, res) => {
    try {
        const { patient_id, medication_name, dosage, frequency, duration, notes } = req.body;
        // Lookup drug price from catalog
        let drugPrice = 0;
        if (medication_name) {
            const drug = (await pool.query('SELECT selling_price FROM pharmacy_drug_catalog WHERE drug_name ILIKE $1 LIMIT 1', [`%${medication_name}%`])).rows[0];
            if (drug) drugPrice = drug.selling_price;
        }
        const result = await pool.query('INSERT INTO prescriptions (patient_id, medication_id, dosage, duration, status) VALUES ($1,0,$2,$3,$4) RETURNING id',
            [patient_id, `${medication_name} ${dosage} ${frequency}`, duration || '', 'Pending']);
        await pool.query('INSERT INTO pharmacy_prescriptions_queue (patient_id, prescription_text, status) VALUES ($1,$2,$3)',
            [patient_id, `${medication_name} - ${dosage} - ${frequency} - ${duration}`, 'Pending']);
        // Auto-create invoice for prescription drug (with VAT for non-Saudis)
        if (drugPrice > 0 && patient_id) {
            const p = (await pool.query('SELECT name_en, name_ar FROM patients WHERE id=$1', [patient_id])).rows[0];
            const vat = await calcVAT(patient_id);
            const { total: finalTotal, vatAmount } = addVAT(drugPrice, vat.rate);
            const desc = `دواء: ${medication_name}` + (vat.applyVAT ? ` (+ ضريبة ${vatAmount} SAR)` : '');
            await pool.query('INSERT INTO invoices (patient_id, patient_name, total, vat_amount, description, service_type, paid) VALUES ($1,$2,$3,$4,$5,$6,0)',
                [patient_id, p?.name_en || p?.name_ar || '', finalTotal, vatAmount, desc, 'Pharmacy']);
        }
        res.json((await pool.query('SELECT * FROM prescriptions WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== PATIENT RESULTS (for Doctor to browse) =====
app.get('/api/patients/:id/results', requireAuth, async (req, res) => {
    try {
        const patient = (await pool.query('SELECT * FROM patients WHERE id=$1', [req.params.id])).rows[0];
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        const labOrders = (await pool.query("SELECT * FROM lab_radiology_orders WHERE patient_id=$1 AND is_radiology=0 ORDER BY created_at DESC", [req.params.id])).rows;
        const radOrders = (await pool.query("SELECT * FROM lab_radiology_orders WHERE patient_id=$1 AND is_radiology=1 ORDER BY created_at DESC", [req.params.id])).rows;
        const records = (await pool.query('SELECT * FROM medical_records WHERE patient_id=$1 ORDER BY visit_date DESC', [req.params.id])).rows;
        res.json({ patient, labOrders, radOrders, records });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== INVOICES (Enhanced) =====
app.post('/api/invoices/generate', requireAuth, async (req, res) => {
    try {
        const { patient_id, items } = req.body;
        const p = (await pool.query('SELECT * FROM patients WHERE id=$1', [patient_id])).rows[0];
        if (!p) return res.status(404).json({ error: 'Patient not found' });
        const total = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
        const description = items.map(i => i.description).join(' | ');
        const result = await pool.query('INSERT INTO invoices (patient_id, patient_name, total, description, service_type) VALUES ($1,$2,$3,$4,$5) RETURNING id',
            [patient_id, p.name_en || p.name_ar, total, description, 'Medical Services']);
        res.json((await pool.query('SELECT * FROM invoices WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/invoices/:id/pay', requireAuth, async (req, res) => {
    try {
        const { payment_method } = req.body;
        await pool.query('UPDATE invoices SET paid=1, payment_method=$1 WHERE id=$2', [payment_method || 'Cash', req.params.id]);
        res.json((await pool.query('SELECT * FROM invoices WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== PATIENT ACCOUNT =====
app.get('/api/patients/:id/account', requireAuth, async (req, res) => {
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
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== FORM BUILDER =====
app.get('/api/forms', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM form_templates WHERE is_active=1 ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/forms', requireAuth, async (req, res) => {
    try {
        const { template_name, department, form_fields } = req.body;
        const result = await pool.query('INSERT INTO form_templates (template_name, department, form_fields, created_by) VALUES ($1,$2,$3,$4) RETURNING id',
            [template_name || '', department || '', form_fields || '[]', req.session.user.name || '']);
        res.json((await pool.query('SELECT * FROM form_templates WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/forms/:id', requireAuth, async (req, res) => {
    try { await pool.query('UPDATE form_templates SET is_active=0 WHERE id=$1', [req.params.id]); res.json({ success: true }); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== WAITING QUEUE =====
app.get('/api/queue/patients', requireAuth, async (req, res) => {
    try { res.json((await pool.query("SELECT * FROM patients WHERE status IN ('Waiting','With Doctor','With Nurse') ORDER BY id DESC")).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/queue/patients/:id/status', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE patients SET status=$1 WHERE id=$2', [status, req.params.id]);
        res.json((await pool.query('SELECT * FROM patients WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/queue/ads', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM queue_advertisements WHERE is_active=1 ORDER BY display_order')).rows); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/queue/ads', requireAuth, async (req, res) => {
    try {
        const { title, image_path, duration_seconds } = req.body;
        const result = await pool.query('INSERT INTO queue_advertisements (title, image_path, duration_seconds) VALUES ($1,$2,$3) RETURNING id',
            [title || '', image_path || '', duration_seconds || 10]);
        res.json((await pool.query('SELECT * FROM queue_advertisements WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== PATIENT REFERRAL =====
app.put('/api/patients/:id/referral', requireAuth, async (req, res) => {
    try {
        const { department } = req.body;
        await pool.query('UPDATE patients SET department=$1 WHERE id=$2', [department, req.params.id]);
        res.json((await pool.query('SELECT * FROM patients WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== REPORTS =====
app.get('/api/reports/financial', requireAuth, async (req, res) => {
    try {
        const totalRevenue = (await pool.query('SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=1')).rows[0].total;
        const totalPending = (await pool.query('SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=0')).rows[0].total;
        const invoiceCount = (await pool.query('SELECT COUNT(*) as cnt FROM invoices')).rows[0].cnt;
        const monthlyRevenue = (await pool.query("SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=1 AND created_at >= date_trunc('month', CURRENT_DATE)")).rows[0].total;
        res.json({ totalRevenue, totalPending, invoiceCount, monthlyRevenue });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/reports/patients', requireAuth, async (req, res) => {
    try {
        const totalPatients = (await pool.query('SELECT COUNT(*) as cnt FROM patients')).rows[0].cnt;
        const todayPatients = (await pool.query("SELECT COUNT(*) as cnt FROM patients WHERE created_at >= CURRENT_DATE")).rows[0].cnt;
        const deptStats = (await pool.query('SELECT department, COUNT(*) as cnt FROM patients GROUP BY department ORDER BY cnt DESC')).rows;
        const statusStats = (await pool.query('SELECT status, COUNT(*) as cnt FROM patients GROUP BY status')).rows;
        res.json({ totalPatients, todayPatients, deptStats, statusStats });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/reports/lab', requireAuth, async (req, res) => {
    try {
        const totalOrders = (await pool.query('SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE is_radiology=0')).rows[0].cnt;
        const pendingOrders = (await pool.query("SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE is_radiology=0 AND status='Requested'")).rows[0].cnt;
        const completedOrders = (await pool.query("SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE is_radiology=0 AND status='Completed'")).rows[0].cnt;
        res.json({ totalOrders, pendingOrders, completedOrders });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== ONLINE BOOKINGS MANAGEMENT =====
app.put('/api/bookings/:id', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE online_bookings SET status=$1 WHERE id=$2', [status, req.params.id]);
        res.json((await pool.query('SELECT * FROM online_bookings WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== DOCTOR COMMISSION REPORT =====
app.get('/api/reports/commissions', requireAuth, async (req, res) => {
    try {
        const doctors = (await pool.query("SELECT id, display_name, speciality, commission_type, commission_value FROM system_users WHERE role='Doctor'")).rows;
        const results = [];
        for (const dr of doctors) {
            // Get all invoices where doctor is linked via medical_records or consultation invoices
            const revenue = (await pool.query(
                `SELECT COALESCE(SUM(i.total), 0) as total FROM invoices i 
                 WHERE i.service_type = 'Consultation' 
                 AND i.description ILIKE $1`, [`%${dr.display_name}%`]
            )).rows[0].total || 0;
            // Also get revenue from lab/radiology orders by this doctor
            const orderRevenue = (await pool.query(
                `SELECT COALESCE(SUM(price), 0) as total FROM lab_radiology_orders WHERE doctor_id=$1`, [dr.id]
            )).rows[0].total || 0;
            const totalRevenue = parseFloat(revenue) + parseFloat(orderRevenue);
            let commission = 0;
            if (dr.commission_type === 'percentage') {
                commission = totalRevenue * (dr.commission_value / 100);
            } else {
                // Fixed per patient
                const patientCount = (await pool.query(
                    'SELECT COUNT(DISTINCT patient_id) as cnt FROM medical_records WHERE doctor_id=$1', [dr.id]
                )).rows[0].cnt || 0;
                commission = patientCount * dr.commission_value;
            }
            results.push({
                doctor_id: dr.id, doctor_name: dr.display_name, speciality: dr.speciality,
                commission_type: dr.commission_type, commission_value: dr.commission_value,
                totalRevenue, commission: Math.round(commission * 100) / 100
            });
        }
        res.json(results);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== MEDICAL CERTIFICATES =====
app.get('/api/medical/certificates', requireAuth, async (req, res) => {
    try {
        const { patient_id } = req.query;
        if (patient_id) {
            res.json((await pool.query('SELECT * FROM medical_certificates WHERE patient_id=$1 ORDER BY id DESC', [patient_id])).rows);
        } else {
            res.json((await pool.query('SELECT * FROM medical_certificates ORDER BY id DESC')).rows);
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/medical/certificates', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, cert_type, diagnosis, notes, start_date, end_date, days } = req.body;
        const doctorName = req.session.user.name || '';
        const doctorId = req.session.user.id || 0;
        const result = await pool.query(
            'INSERT INTO medical_certificates (patient_id, patient_name, doctor_id, doctor_name, cert_type, diagnosis, notes, start_date, end_date, days) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id',
            [patient_id, patient_name || '', doctorId, doctorName, cert_type || 'sick_leave', diagnosis || '', notes || '', start_date || '', end_date || '', days || 0]);
        res.json((await pool.query('SELECT * FROM medical_certificates WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== PATIENT REFERRALS =====
app.get('/api/referrals', requireAuth, async (req, res) => {
    try {
        const { patient_id } = req.query;
        if (patient_id) {
            res.json((await pool.query('SELECT * FROM patient_referrals WHERE patient_id=$1 ORDER BY id DESC', [patient_id])).rows);
        } else {
            res.json((await pool.query('SELECT * FROM patient_referrals ORDER BY id DESC')).rows);
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/referrals', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, to_department, to_doctor, reason, urgency, notes } = req.body;
        const fromDoctor = req.session.user.name || '';
        const fromDoctorId = req.session.user.id || 0;
        const result = await pool.query(
            'INSERT INTO patient_referrals (patient_id, patient_name, from_doctor_id, from_doctor, to_department, to_doctor, reason, urgency, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id',
            [patient_id, patient_name || '', fromDoctorId, fromDoctor, to_department || '', to_doctor || '', reason || '', urgency || 'Normal', notes || '']);
        res.json((await pool.query('SELECT * FROM patient_referrals WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/referrals/:id', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE patient_referrals SET status=$1 WHERE id=$2', [status, req.params.id]);
        res.json((await pool.query('SELECT * FROM patient_referrals WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== FOLLOW-UP APPOINTMENTS =====
app.post('/api/appointments/followup', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, doctor_name, appt_date, appt_time, notes } = req.body;
        const result = await pool.query(
            'INSERT INTO appointments (patient_id, patient_name, doctor_name, department, appt_date, appt_time, notes, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
            [patient_id, patient_name, doctor_name || req.session.user.name, '', appt_date, appt_time || '09:00', `متابعة: ${notes || ''}`, 'Confirmed']);
        res.json((await pool.query('SELECT * FROM appointments WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== ENHANCED DASHBOARD STATS =====
app.get('/api/dashboard/enhanced', requireAuth, async (req, res) => {
    try {
        const today = 'CURRENT_DATE';
        const todayRevenue = (await pool.query(`SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE created_at::date = CURRENT_DATE`)).rows[0].total;
        const monthRevenue = (await pool.query(`SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE created_at >= date_trunc('month', CURRENT_DATE)`)).rows[0].total;
        const unpaidTotal = (await pool.query(`SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE paid = 0`)).rows[0].total;
        const todayAppts = (await pool.query(`SELECT COUNT(*) as cnt FROM appointments WHERE appt_date = CURRENT_DATE::TEXT`)).rows[0].cnt;
        const pendingLab = (await pool.query(`SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE status = 'Requested' AND is_radiology = 0`)).rows[0].cnt;
        const pendingRad = (await pool.query(`SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE status = 'Requested' AND is_radiology = 1`)).rows[0].cnt;
        const pendingRx = (await pool.query(`SELECT COUNT(*) as cnt FROM pharmacy_prescriptions_queue WHERE status = 'Pending'`)).rows[0].cnt;
        const pendingReferrals = (await pool.query(`SELECT COUNT(*) as cnt FROM patient_referrals WHERE status = 'Pending'`)).rows[0].cnt;
        // Top doctors by revenue this month
        const topDoctors = (await pool.query(`
            SELECT mr.doctor_id, su.display_name, COUNT(DISTINCT mr.patient_id) as patients,
                   COALESCE(SUM(i.total), 0) as revenue
            FROM medical_records mr
            LEFT JOIN system_users su ON mr.doctor_id = su.id
            LEFT JOIN invoices i ON i.patient_id = mr.patient_id AND i.service_type = 'Consultation'
            WHERE mr.visit_date >= date_trunc('month', CURRENT_DATE)
            GROUP BY mr.doctor_id, su.display_name
            ORDER BY revenue DESC LIMIT 5
        `)).rows;
        // Revenue by service type
        const revenueByType = (await pool.query(`
            SELECT service_type, COALESCE(SUM(total), 0) as total, COUNT(*) as cnt
            FROM invoices WHERE created_at >= date_trunc('month', CURRENT_DATE)
            GROUP BY service_type ORDER BY total DESC
        `)).rows;
        res.json({ todayRevenue, monthRevenue, unpaidTotal, todayAppts, pendingLab, pendingRad, pendingRx, pendingReferrals, topDoctors, revenueByType });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== PATIENT VISIT TIMELINE =====
app.get('/api/patients/:id/timeline', requireAuth, async (req, res) => {
    try {
        const pid = req.params.id;
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
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// SPA fallback
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== INIT & START =====
async function startServer() {
    try {
        console.log('\n  🐘 Connecting to PostgreSQL...');
        await initDatabase();
        await insertSampleData();
        await populateLabCatalog();
        await populateRadiologyCatalog();
        await populateMedicalServices();
        await populateBaseDrugs();
        app.listen(PORT, () => {
            console.log(`\n  ✅ Nama Medical Web is running!`);
            console.log(`  🌐 Open: http://localhost:${PORT}`);
            console.log(`  📦 Database: PostgreSQL (nama_medical_web)\n`);
        });
    } catch (err) {
        console.error('  ❌ Failed to start:', err.message);
        process.exit(1);
    }
}

startServer();
