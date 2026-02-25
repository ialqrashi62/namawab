require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { pool, initDatabase } = require('./db_postgres');
const bcrypt = require('bcryptjs');
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
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));

// Rate limiting for login endpoint
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many login attempts, please try again after 15 minutes' } });

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'nama-medical-erp-secret-x7k9m2p4q8w1',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 8 * 60 * 60 * 1000 },
    rolling: true
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Auth middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.user) return next();
    res.status(401).json({ error: 'Unauthorized' });
}

// RBAC middleware - role-based access control
const ROLE_PERMISSIONS = {
    'Admin': '*',
    'Doctor': ['dashboard', 'patients', 'appointments', 'doctor', 'lab', 'radiology', 'pharmacy', 'nursing', 'waiting', 'reports', 'messaging', 'surgery', 'consent', 'icu'],
    'Nurse': ['dashboard', 'patients', 'nursing', 'waiting', 'vitals', 'icu', 'emergency', 'inpatient', 'transport', 'dietary'],
    'Pharmacist': ['dashboard', 'pharmacy', 'inventory', 'messaging'],
    'Lab Technician': ['dashboard', 'lab', 'messaging'],
    'Radiologist': ['dashboard', 'radiology', 'messaging'],
    'Reception': ['dashboard', 'patients', 'appointments', 'waiting', 'messaging', 'accounts'],
    'Finance': ['dashboard', 'finance', 'insurance', 'reports', 'accounts', 'invoices'],
    'HR': ['dashboard', 'hr', 'messaging', 'reports'],
    'IT': ['dashboard', 'settings', 'messaging', 'maintenance'],
    'Staff': ['dashboard', 'messaging']
};
function requireRole(...modules) {
    return (req, res, next) => {
        if (!req.session || !req.session.user) return res.status(401).json({ error: 'Unauthorized' });
        const role = req.session.user.role;
        const perms = ROLE_PERMISSIONS[role];
        if (perms === '*') return next(); // Admin
        if (perms && modules.some(m => perms.includes(m))) return next();
        res.status(403).json({ error: 'Access denied' });
    };
}

// Audit trail helper
async function logAudit(userId, userName, action, module, details, ip) {
    try {
        await pool.query(
            'INSERT INTO audit_trail (user_id, user_name, action, module, details, ip_address) VALUES ($1,$2,$3,$4,$5,$6)',
            [userId, userName, action, module, details || '', ip || '']
        );
    } catch (e) { console.error('Audit log error:', e.message); }
}

// ===== AUTH ROUTES =====
app.post('/api/auth/login', loginLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
        const { rows } = await pool.query('SELECT id, display_name, role, speciality, permissions, password_hash FROM system_users WHERE username=$1 AND is_active=1', [username]);
        if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
        const user = rows[0];
        // Check bcrypt hash, or fallback to plain text (auto-migrate)
        let valid = false;
        if (user.password_hash && user.password_hash.startsWith('$2')) {
            valid = await bcrypt.compare(password, user.password_hash);
        } else {
            // Plain text fallback — migrate to bcrypt on successful login
            valid = (password === user.password_hash);
            if (valid) {
                const hash = await bcrypt.hash(password, 10);
                await pool.query('UPDATE system_users SET password_hash=$1 WHERE id=$2', [hash, user.id]);
            }
        }
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
        req.session.user = { id: user.id, name: user.display_name, role: user.role, speciality: user.speciality || '', permissions: user.permissions || '' };
        logAudit(user.id, user.display_name, 'LOGIN', 'Auth', `User logged in as ${user.role}`, req.ip);
        res.json({ success: true, user: req.session.user });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== PATIENTS =====
app.get('/api/patients', requireAuth, async (req, res) => {
    try {
        const { search } = req.query;
        let rows;
        if (search) {
            const s = `%${search}%`;
            rows = (await pool.query(`SELECT * FROM patients WHERE (is_deleted IS NULL OR is_deleted=0) AND (name_ar ILIKE $1 OR name_en ILIKE $2 OR national_id LIKE $3 OR phone LIKE $4 OR CAST(file_number AS TEXT) LIKE $5 OR COALESCE(mrn,'') ILIKE $6) ORDER BY id DESC LIMIT 200`, [s, s, s, s, s, s])).rows;
        } else {
            rows = (await pool.query('SELECT * FROM patients WHERE (is_deleted IS NULL OR is_deleted=0) ORDER BY id DESC LIMIT 200')).rows;
        }
        res.json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/patients', requireAuth, async (req, res) => {
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
        const result = await pool.query('INSERT INTO patients (file_number, mrn, name_ar, name_en, national_id, nationality, gender, phone, department, amount, payment_method, dob, dob_hijri, age, blood_type, allergies, chronic_diseases, emergency_contact_name, emergency_contact_phone, address, insurance_company, insurance_policy_number, insurance_class) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23) RETURNING id',
            [newFileNum, mrn, name_ar || '', name_en || '', national_id || '', nationality || '', gender || '', phone || '', department || '', fileOpenFee, payment_method || '', dob || '', dob_hijri || '', age || 0, blood_type || '', allergies || '', chronic_diseases || '', emergency_contact_name || '', emergency_contact_phone || '', address || '', insurance_company || '', insurance_policy_number || '', insurance_class || '']);
        const patient = (await pool.query('SELECT * FROM patients WHERE id=$1', [result.rows[0].id])).rows[0];
        // Auto-create invoice for file opening fee (with VAT for non-Saudis)
        if (fileOpenFee > 0) {
            const vat = await calcVAT(patient.id);
            const { total: finalTotal, vatAmount } = addVAT(fileOpenFee, vat.rate);
            const desc = vat.applyVAT ? `فتح ملف / File Opening Fee (+ ضريبة ${vatAmount} SAR)` : 'فتح ملف / File Opening Fee';
            await pool.query('INSERT INTO invoices (patient_id, patient_name, total, vat_amount, description, service_type, paid, payment_method) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
                [patient.id, name_en || name_ar, finalTotal, vatAmount, desc, 'File Opening', payment_method === 'كاش' || payment_method === 'Cash' ? 1 : 0, payment_method || '']);
        }
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_PATIENT', 'Patients', 'Created patient ' + (name_en || name_ar) + ' MRN:' + mrn, req.ip);
        res.json(patient);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/patients/:id', requireAuth, async (req, res) => {
    try {
        const { name_ar, name_en, national_id, nationality, gender, phone, dob, dob_hijri, department, status, blood_type, allergies, chronic_diseases, emergency_contact_name, emergency_contact_phone, address, insurance_company, insurance_policy_number, insurance_class } = req.body;
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
            await pool.query(`UPDATE patients SET ${sets.join(',')} WHERE id=$${i}`, vals);
        }
        const patient = (await pool.query('SELECT * FROM patients WHERE id=$1', [req.params.id])).rows[0];
        res.json(patient);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== NURSING =====
app.get('/api/nursing/vitals', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM nursing_vitals ORDER BY id DESC LIMIT 100')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/nursing/vitals/:patientId', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM nursing_vitals WHERE patient_id=$1 ORDER BY id DESC LIMIT 1', [req.params.patientId])).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/nursing/vitals', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, bp, temp, weight, height, pulse, o2_sat, respiratory_rate, blood_sugar, chronic_diseases, current_medications, allergies, notes } = req.body;
        await pool.query('INSERT INTO nursing_vitals (patient_id, patient_name, bp, temp, weight, height, pulse, o2_sat, respiratory_rate, blood_sugar, chronic_diseases, current_medications, allergies, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',
            [patient_id, patient_name || '', bp || '', temp || 0, weight || 0, height || 0, pulse || 0, o2_sat || 0, respiratory_rate || 0, blood_sugar || 0, chronic_diseases || '', current_medications || '', allergies || '', notes || '']);
        await pool.query('UPDATE patients SET status=$1 WHERE id=$2', ['Waiting', patient_id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== APPOINTMENTS =====
app.get('/api/appointments', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM appointments ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/appointments/:id', requireAuth, async (req, res) => {
    try { await pool.query('DELETE FROM appointments WHERE id=$1', [req.params.id]); res.json({ success: true }); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== EMPLOYEES =====
app.get('/api/employees', requireAuth, async (req, res) => {
    try {
        const { role } = req.query;
        if (role) { res.json((await pool.query('SELECT * FROM employees WHERE role LIKE $1 ORDER BY name', [`%${role}%`])).rows); }
        else { res.json((await pool.query('SELECT * FROM employees ORDER BY id DESC')).rows); }
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/employees', requireAuth, async (req, res) => {
    try {
        const { name, name_ar, name_en, role, department_ar, department_en, salary, commission_type, commission_value } = req.body;
        const result = await pool.query('INSERT INTO employees (name, name_ar, name_en, role, department_ar, department_en, salary, commission_type, commission_value) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id',
            [name || name_en, name_ar || '', name_en || '', role || 'Staff', department_ar || '', department_en || '', salary || 0, commission_type || 'percentage', parseFloat(commission_value) || 0]);
        res.json((await pool.query('SELECT * FROM employees WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/employees/:id', requireAuth, async (req, res) => {
    try { await pool.query('DELETE FROM employees WHERE id=$1', [req.params.id]); res.json({ success: true }); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== INVOICES =====
app.get('/api/invoices', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM invoices ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/invoices', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, total, description, service_type, payment_method, discount, discount_reason } = req.body;
        // Generate sequential invoice number
        const maxInv = (await pool.query("SELECT invoice_number FROM invoices WHERE invoice_number LIKE 'INV-%' ORDER BY id DESC LIMIT 1")).rows[0];
        let nextNum = 1;
        if (maxInv && maxInv.invoice_number) { const parts = maxInv.invoice_number.split('-'); nextNum = parseInt(parts[2]) + 1; }
        const invNumber = 'INV-' + new Date().getFullYear() + '-' + String(nextNum).padStart(5, '0');
        const createdBy = req.session.user?.display_name || '';
        const result = await pool.query(
            'INSERT INTO invoices (patient_id, patient_name, total, description, service_type, payment_method, discount, discount_reason, invoice_number, created_by, original_amount) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id',
            [patient_id || null, patient_name, total || 0, description || '', service_type || '', payment_method || '', discount || 0, discount_reason || '', invNumber, createdBy, (total || 0) + (discount || 0)]);
        logAudit(req.session.user?.id, createdBy, 'CREATE_INVOICE', 'Finance', invNumber + ' - ' + (total || 0) + ' SAR for ' + patient_name, req.ip);
        res.json((await pool.query('SELECT * FROM invoices WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== INSURANCE =====
app.get('/api/insurance/companies', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM insurance_companies ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/insurance/companies', requireAuth, async (req, res) => {
    try {
        const { name_ar, name_en, contact_info } = req.body;
        const result = await pool.query('INSERT INTO insurance_companies (name_ar, name_en, contact_info) VALUES ($1,$2,$3) RETURNING id',
            [name_ar || '', name_en || '', contact_info || '']);
        res.json((await pool.query('SELECT * FROM insurance_companies WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/insurance/claims', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM insurance_claims ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/insurance/claims', requireAuth, async (req, res) => {
    try {
        const { patient_name, insurance_company, claim_amount } = req.body;
        const result = await pool.query('INSERT INTO insurance_claims (patient_name, insurance_company, claim_amount) VALUES ($1,$2,$3) RETURNING id',
            [patient_name, insurance_company, claim_amount || 0]);
        res.json((await pool.query('SELECT * FROM insurance_claims WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/insurance/claims/:id', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        if (status) await pool.query('UPDATE insurance_claims SET status=$1 WHERE id=$2', [status, req.params.id]);
        res.json((await pool.query('SELECT * FROM insurance_claims WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/medical/records', requireAuth, async (req, res) => {
    try {
        const { patient_id } = req.query;
        if (patient_id) {
            res.json((await pool.query('SELECT mr.*, p.name_en as patient_name FROM medical_records mr LEFT JOIN patients p ON mr.patient_id=p.id WHERE mr.patient_id=$1 ORDER BY mr.id DESC', [patient_id])).rows);
        } else {
            res.json((await pool.query('SELECT mr.*, p.name_en as patient_name FROM medical_records mr LEFT JOIN patients p ON mr.patient_id=p.id ORDER BY mr.id DESC')).rows);
        }
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/medical/records', requireAuth, async (req, res) => {
    try {
        const { patient_id, doctor_id, diagnosis, symptoms, icd10_codes, notes } = req.body;
        const result = await pool.query('INSERT INTO medical_records (patient_id, doctor_id, diagnosis, symptoms, icd10_codes, notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
            [patient_id, doctor_id || 0, diagnosis || '', symptoms || '', icd10_codes || '', notes || '']);
        res.json((await pool.query('SELECT * FROM medical_records WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== MEDICAL SERVICES =====
app.get('/api/medical/services', requireAuth, async (req, res) => {
    try {
        const { specialty } = req.query;
        if (specialty) { res.json((await pool.query('SELECT * FROM medical_services WHERE specialty=$1 ORDER BY category, name_en', [specialty])).rows); }
        else { res.json((await pool.query('SELECT * FROM medical_services ORDER BY specialty, category, name_en')).rows); }
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/medical/services/:id', requireAuth, async (req, res) => {
    try {
        const { price } = req.body;
        if (price !== undefined) await pool.query('UPDATE medical_services SET price=$1 WHERE id=$2', [price, req.params.id]);
        res.json((await pool.query('SELECT * FROM medical_services WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== DEPARTMENT RESOURCE REQUESTS =====
app.get('/api/dept-requests', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM inventory_dept_requests ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/dept-requests/:id/items', requireAuth, async (req, res) => {
    try {
        res.json((await pool.query('SELECT dri.*, ii.item_name FROM inventory_dept_request_items dri LEFT JOIN inventory_items ii ON dri.item_id=ii.id WHERE dri.request_id=$1', [req.params.id])).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== CATALOG APIs =====
app.get('/api/catalog/lab', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM lab_tests_catalog ORDER BY category, test_name')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/catalog/lab/:id', requireAuth, async (req, res) => {
    try {
        const { price } = req.body;
        if (price !== undefined) await pool.query('UPDATE lab_tests_catalog SET price=$1 WHERE id=$2', [price, req.params.id]);
        res.json((await pool.query('SELECT * FROM lab_tests_catalog WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/catalog/radiology', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM radiology_catalog ORDER BY modality, exact_name')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/catalog/radiology/:id', requireAuth, async (req, res) => {
    try {
        const { price } = req.body;
        if (price !== undefined) await pool.query('UPDATE radiology_catalog SET price=$1 WHERE id=$2', [price, req.params.id]);
        res.json((await pool.query('SELECT * FROM radiology_catalog WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== LAB =====
app.get('/api/lab/orders', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT lo.*, p.name_en as patient_name FROM lab_radiology_orders lo LEFT JOIN patients p ON lo.patient_id=p.id WHERE lo.is_radiology=0 ORDER BY lo.id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/lab/catalog', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM lab_tests_catalog ORDER BY id')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/lab/orders/:id', requireAuth, async (req, res) => {
    try {
        const { status, result: testResult } = req.body;
        if (status) await pool.query('UPDATE lab_radiology_orders SET status=$1 WHERE id=$2', [status, req.params.id]);
        if (testResult) await pool.query('UPDATE lab_radiology_orders SET results=$1 WHERE id=$2', [testResult, req.params.id]);
        res.json((await pool.query('SELECT * FROM lab_radiology_orders WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== RADIOLOGY =====
app.get('/api/radiology/orders', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT lo.*, p.name_en as patient_name FROM lab_radiology_orders lo LEFT JOIN patients p ON lo.patient_id=p.id WHERE lo.is_radiology=1 ORDER BY lo.id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/radiology/catalog', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM radiology_catalog ORDER BY id')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/radiology/orders/:id', requireAuth, async (req, res) => {
    try {
        const { status, result: testResult } = req.body;
        if (status) await pool.query('UPDATE lab_radiology_orders SET status=$1 WHERE id=$2', [status, req.params.id]);
        if (testResult) await pool.query('UPDATE lab_radiology_orders SET results=$1 WHERE id=$2', [testResult, req.params.id]);
        res.json((await pool.query('SELECT * FROM lab_radiology_orders WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== PHARMACY =====
app.get('/api/pharmacy/drugs', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM pharmacy_drug_catalog WHERE is_active=1 ORDER BY drug_name')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Pharmacy low stock alerts
app.get('/api/pharmacy/low-stock', requireAuth, async (req, res) => {
    try {
        const lowStock = (await pool.query('SELECT * FROM pharmacy_drug_catalog WHERE is_active=1 AND stock_qty <= COALESCE(min_stock_level, 10) ORDER BY stock_qty ASC')).rows;
        res.json(lowStock);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/pharmacy/drugs', requireAuth, async (req, res) => {
    try {
        const { drug_name, active_ingredient, category, unit, selling_price, cost_price, stock_qty } = req.body;
        const result = await pool.query('INSERT INTO pharmacy_drug_catalog (drug_name, active_ingredient, category, unit, selling_price, cost_price, stock_qty) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
            [drug_name, active_ingredient || '', category || '', unit || '', selling_price || 0, cost_price || 0, stock_qty || 0]);
        res.json((await pool.query('SELECT * FROM pharmacy_drug_catalog WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/pharmacy/queue', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT pq.*, p.name_en as patient_name FROM pharmacy_prescriptions_queue pq LEFT JOIN patients p ON pq.patient_id=p.id ORDER BY pq.id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/pharmacy/queue/:id', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        if (status) await pool.query('UPDATE pharmacy_prescriptions_queue SET status=$1, dispensed_at=CURRENT_TIMESTAMP WHERE id=$2', [status, req.params.id]);
        res.json((await pool.query('SELECT * FROM pharmacy_prescriptions_queue WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== INVENTORY =====
app.get('/api/inventory/items', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM inventory_items WHERE is_active=1 ORDER BY item_name')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/inventory/items', requireAuth, async (req, res) => {
    try {
        const { item_name, item_code, category, unit, cost_price, stock_qty } = req.body;
        const result = await pool.query('INSERT INTO inventory_items (item_name, item_code, category, unit, cost_price, stock_qty) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
            [item_name, item_code || '', category || '', unit || '', cost_price || 0, stock_qty || 0]);
        res.json((await pool.query('SELECT * FROM inventory_items WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== HR =====
app.get('/api/hr/employees', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM hr_employees WHERE is_active=1 ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/hr/employees', requireAuth, async (req, res) => {
    try {
        const { emp_number, name_ar, name_en, national_id, phone, email, department, job_title, hire_date, basic_salary, housing_allowance, transport_allowance } = req.body;
        const result = await pool.query('INSERT INTO hr_employees (emp_number, name_ar, name_en, national_id, phone, email, department, job_title, hire_date, basic_salary, housing_allowance, transport_allowance) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id',
            [emp_number || '', name_ar || '', name_en || '', national_id || '', phone || '', email || '', department || '', job_title || '', hire_date || '', basic_salary || 0, housing_allowance || 0, transport_allowance || 0]);
        res.json((await pool.query('SELECT * FROM hr_employees WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/hr/salaries', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT hs.*, he.name_en as employee_name FROM hr_salaries hs LEFT JOIN hr_employees he ON hs.employee_id=he.id ORDER BY hs.id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/hr/leaves', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT hl.*, he.name_en as employee_name FROM hr_leaves hl LEFT JOIN hr_employees he ON hl.employee_id=he.id ORDER BY hl.id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/hr/attendance', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT ha.*, he.name_en as employee_name FROM hr_attendance ha LEFT JOIN hr_employees he ON ha.employee_id=he.id ORDER BY ha.id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== FINANCE =====
app.get('/api/finance/accounts', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM finance_chart_of_accounts WHERE is_active=1 ORDER BY account_code')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/finance/accounts', requireAuth, async (req, res) => {
    try {
        const { account_code, account_name_ar, account_name_en, parent_id, account_type } = req.body;
        const result = await pool.query('INSERT INTO finance_chart_of_accounts (account_code, account_name_ar, account_name_en, parent_id, account_type) VALUES ($1,$2,$3,$4,$5) RETURNING id',
            [account_code || '', account_name_ar || '', account_name_en || '', parent_id || 0, account_type || '']);
        res.json((await pool.query('SELECT * FROM finance_chart_of_accounts WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/finance/journal', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM finance_journal_entries ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/finance/vouchers', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM finance_vouchers ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== SETTINGS =====
app.get('/api/settings', requireAuth, async (req, res) => {
    try {
        const rows = (await pool.query('SELECT * FROM company_settings')).rows;
        const settings = {};
        rows.forEach(r => settings[r.setting_key] = r.setting_value);
        res.json(settings);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/settings', requireAuth, async (req, res) => {
    try {
        const updates = req.body;
        for (const [key, value] of Object.entries(updates)) {
            await pool.query('INSERT INTO company_settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value=$2', [key, value]);
        }
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/settings/users', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT id, username, display_name, role, speciality, permissions, commission_type, commission_value, is_active, created_at FROM system_users ORDER BY id')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/settings/users', requireAuth, async (req, res) => {
    try {
        const { username, password, display_name, role, speciality, permissions, commission_type, commission_value } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query('INSERT INTO system_users (username, password_hash, display_name, role, speciality, permissions, commission_type, commission_value) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
            [username, hash, display_name || '', role || 'Reception', speciality || '', permissions || '', commission_type || 'percentage', parseFloat(commission_value) || 0]);
        res.json((await pool.query('SELECT id, username, display_name, role, speciality, permissions, commission_type, commission_value, is_active, created_at FROM system_users WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/settings/users/:id', requireAuth, async (req, res) => {
    try {
        const { username, password, display_name, role, speciality, permissions, is_active, commission_type, commission_value } = req.body;
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
        params.push(req.params.id);
        await pool.query(query, params);
        res.json((await pool.query('SELECT id, username, display_name, role, speciality, permissions, commission_type, commission_value, is_active, created_at FROM system_users WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== MESSAGING =====
app.get('/api/messages', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;
        res.json((await pool.query('SELECT im.*, su.display_name as sender_name FROM internal_messages im LEFT JOIN system_users su ON im.sender_id=su.id WHERE im.receiver_id=$1 ORDER BY im.id DESC', [userId])).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/messages', requireAuth, async (req, res) => {
    try {
        const { receiver_id, subject, body, priority } = req.body;
        const result = await pool.query('INSERT INTO internal_messages (sender_id, receiver_id, subject, body, priority) VALUES ($1,$2,$3,$4,$5) RETURNING id',
            [req.session.user.id, receiver_id, subject || '', body || '', priority || 'Normal']);
        res.json((await pool.query('SELECT * FROM internal_messages WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== ONLINE BOOKINGS =====
app.get('/api/bookings', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM online_bookings ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== PRESCRIPTIONS =====
app.get('/api/prescriptions', requireAuth, async (req, res) => {
    try {
        const { patient_id } = req.query;
        if (patient_id) { res.json((await pool.query('SELECT * FROM prescriptions WHERE patient_id=$1 ORDER BY id DESC', [patient_id])).rows); }
        else { res.json((await pool.query('SELECT * FROM prescriptions ORDER BY id DESC')).rows); }
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/invoices/:id/pay', requireAuth, async (req, res) => {
    try {
        const { payment_method } = req.body;
        await pool.query('UPDATE invoices SET paid=1, payment_method=$1 WHERE id=$2', [payment_method || 'Cash', req.params.id]);
        res.json((await pool.query('SELECT * FROM invoices WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== FORM BUILDER =====
app.get('/api/forms', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM form_templates WHERE is_active=1 ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/forms', requireAuth, async (req, res) => {
    try {
        const { template_name, department, form_fields } = req.body;
        const result = await pool.query('INSERT INTO form_templates (template_name, department, form_fields, created_by) VALUES ($1,$2,$3,$4) RETURNING id',
            [template_name || '', department || '', form_fields || '[]', req.session.user.name || '']);
        res.json((await pool.query('SELECT * FROM form_templates WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/forms/:id', requireAuth, async (req, res) => {
    try { await pool.query('UPDATE form_templates SET is_active=0 WHERE id=$1', [req.params.id]); res.json({ success: true }); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== WAITING QUEUE =====
app.get('/api/queue/patients', requireAuth, async (req, res) => {
    try { res.json((await pool.query("SELECT * FROM patients WHERE status IN ('Waiting','With Doctor','With Nurse') ORDER BY id DESC")).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/queue/patients/:id/status', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE patients SET status=$1 WHERE id=$2', [status, req.params.id]);
        res.json((await pool.query('SELECT * FROM patients WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/queue/ads', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM queue_advertisements WHERE is_active=1 ORDER BY display_order')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/queue/ads', requireAuth, async (req, res) => {
    try {
        const { title, image_path, duration_seconds } = req.body;
        const result = await pool.query('INSERT INTO queue_advertisements (title, image_path, duration_seconds) VALUES ($1,$2,$3) RETURNING id',
            [title || '', image_path || '', duration_seconds || 10]);
        res.json((await pool.query('SELECT * FROM queue_advertisements WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== PATIENT REFERRAL =====
app.put('/api/patients/:id/referral', requireAuth, async (req, res) => {
    try {
        const { department } = req.body;
        await pool.query('UPDATE patients SET department=$1 WHERE id=$2', [department, req.params.id]);
        res.json((await pool.query('SELECT * FROM patients WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== REPORTS =====
app.get('/api/reports/financial', requireAuth, async (req, res) => {
    try {
        const totalRevenue = (await pool.query('SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=1')).rows[0].total;
        const totalPending = (await pool.query('SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=0')).rows[0].total;
        const invoiceCount = (await pool.query('SELECT COUNT(*) as cnt FROM invoices')).rows[0].cnt;
        const monthlyRevenue = (await pool.query("SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=1 AND created_at >= date_trunc('month', CURRENT_DATE)")).rows[0].total;
        res.json({ totalRevenue, totalPending, invoiceCount, monthlyRevenue });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/reports/patients', requireAuth, async (req, res) => {
    try {
        const totalPatients = (await pool.query('SELECT COUNT(*) as cnt FROM patients')).rows[0].cnt;
        const todayPatients = (await pool.query("SELECT COUNT(*) as cnt FROM patients WHERE created_at >= CURRENT_DATE")).rows[0].cnt;
        const deptStats = (await pool.query('SELECT department, COUNT(*) as cnt FROM patients GROUP BY department ORDER BY cnt DESC')).rows;
        const statusStats = (await pool.query('SELECT status, COUNT(*) as cnt FROM patients GROUP BY status')).rows;
        res.json({ totalPatients, todayPatients, deptStats, statusStats });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/reports/lab', requireAuth, async (req, res) => {
    try {
        const totalOrders = (await pool.query('SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE is_radiology=0')).rows[0].cnt;
        const pendingOrders = (await pool.query("SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE is_radiology=0 AND status='Requested'")).rows[0].cnt;
        const completedOrders = (await pool.query("SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE is_radiology=0 AND status='Completed'")).rows[0].cnt;
        res.json({ totalOrders, pendingOrders, completedOrders });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== ONLINE BOOKINGS MANAGEMENT =====
app.put('/api/bookings/:id', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE online_bookings SET status=$1 WHERE id=$2', [status, req.params.id]);
        res.json((await pool.query('SELECT * FROM online_bookings WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/referrals/:id', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE patient_referrals SET status=$1 WHERE id=$2', [status, req.params.id]);
        res.json((await pool.query('SELECT * FROM patient_referrals WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== FOLLOW-UP APPOINTMENTS =====
app.post('/api/appointments/followup', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, doctor_name, appt_date, appt_time, notes } = req.body;
        const result = await pool.query(
            'INSERT INTO appointments (patient_id, patient_name, doctor_name, department, appt_date, appt_time, notes, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
            [patient_id, patient_name, doctor_name || req.session.user.name, '', appt_date, appt_time || '09:00', `متابعة: ${notes || ''}`, 'Confirmed']);
        res.json((await pool.query('SELECT * FROM appointments WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== SURGERY MANAGEMENT =====
app.get('/api/surgeries', requireAuth, async (req, res) => {
    try {
        const { status, date } = req.query;
        let q = 'SELECT * FROM surgeries';
        const params = [];
        const conds = [];
        if (status) { params.push(status); conds.push(`status=$${params.length}`); }
        if (date) { params.push(date); conds.push(`scheduled_date=$${params.length}`); }
        if (conds.length) q += ' WHERE ' + conds.join(' AND ');
        q += ' ORDER BY scheduled_date DESC, scheduled_time DESC';
        res.json((await pool.query(q, params)).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/surgeries', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, surgeon_id, surgeon_name, anesthetist_id, anesthetist_name,
            procedure_name, procedure_name_ar, surgery_type, operating_room, priority,
            scheduled_date, scheduled_time, estimated_duration, notes } = req.body;
        const result = await pool.query(
            `INSERT INTO surgeries (patient_id, patient_name, surgeon_id, surgeon_name, anesthetist_id, anesthetist_name,
             procedure_name, procedure_name_ar, surgery_type, operating_room, priority,
             scheduled_date, scheduled_time, estimated_duration, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
            [patient_id, patient_name || '', surgeon_id || 0, surgeon_name || '', anesthetist_id || 0, anesthetist_name || '',
                procedure_name || '', procedure_name_ar || '', surgery_type || 'Elective', operating_room || '',
                priority || 'Normal', scheduled_date || '', scheduled_time || '', estimated_duration || 60, notes || '']);
        res.json((await pool.query('SELECT * FROM surgeries WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/surgeries/:id', requireAuth, async (req, res) => {
    try {
        const { status, operating_room, scheduled_date, scheduled_time, actual_start, actual_end, post_op_notes, preop_status } = req.body;
        const fields = []; const params = []; let idx = 1;
        if (status !== undefined) { fields.push(`status=$${idx++}`); params.push(status); }
        if (operating_room !== undefined) { fields.push(`operating_room=$${idx++}`); params.push(operating_room); }
        if (scheduled_date !== undefined) { fields.push(`scheduled_date=$${idx++}`); params.push(scheduled_date); }
        if (scheduled_time !== undefined) { fields.push(`scheduled_time=$${idx++}`); params.push(scheduled_time); }
        if (actual_start !== undefined) { fields.push(`actual_start=$${idx++}`); params.push(actual_start); }
        if (actual_end !== undefined) { fields.push(`actual_end=$${idx++}`); params.push(actual_end); }
        if (post_op_notes !== undefined) { fields.push(`post_op_notes=$${idx++}`); params.push(post_op_notes); }
        if (preop_status !== undefined) { fields.push(`preop_status=$${idx++}`); params.push(preop_status); }
        if (fields.length) {
            params.push(req.params.id);
            await pool.query(`UPDATE surgeries SET ${fields.join(',')} WHERE id=$${idx}`, params);
        }
        res.json((await pool.query('SELECT * FROM surgeries WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/surgeries/:id', requireAuth, async (req, res) => {
    try {
        await pool.query('DELETE FROM surgery_preop_tests WHERE surgery_id=$1', [req.params.id]);
        await pool.query('DELETE FROM surgery_preop_assessments WHERE surgery_id=$1', [req.params.id]);
        await pool.query('DELETE FROM surgery_anesthesia_records WHERE surgery_id=$1', [req.params.id]);
        await pool.query('DELETE FROM consent_forms WHERE surgery_id=$1', [req.params.id]);
        await pool.query('DELETE FROM surgeries WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Pre-op Assessment
app.get('/api/surgeries/:id/preop', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM surgery_preop_assessments WHERE surgery_id=$1', [req.params.id])).rows[0] || null); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/surgeries/:id/preop', requireAuth, async (req, res) => {
    try {
        const s = req.body;
        const existing = (await pool.query('SELECT id FROM surgery_preop_assessments WHERE surgery_id=$1', [req.params.id])).rows[0];
        const surgery = (await pool.query('SELECT patient_id FROM surgeries WHERE id=$1', [req.params.id])).rows[0];
        const pid = surgery?.patient_id || 0;
        // Calculate overall status
        const checkItems = [s.npo_confirmed, s.allergies_reviewed, s.medications_reviewed, s.labs_reviewed,
        s.imaging_reviewed, s.blood_type_confirmed, s.consent_signed, s.anesthesia_clearance, s.nursing_assessment];
        const completedCount = checkItems.filter(x => x).length;
        const overall = completedCount === checkItems.length ? 'Complete' : completedCount > 0 ? 'In Progress' : 'Incomplete';
        if (existing) {
            await pool.query(`UPDATE surgery_preop_assessments SET npo_confirmed=$1, allergies_reviewed=$2, allergies_notes=$3,
                medications_reviewed=$4, medications_notes=$5, labs_reviewed=$6, labs_notes=$7, imaging_reviewed=$8, imaging_notes=$9,
                blood_type_confirmed=$10, blood_reserved=$11, consent_signed=$12, anesthesia_clearance=$13,
                nursing_assessment=$14, nursing_notes=$15, cardiac_clearance=$16, cardiac_notes=$17,
                pulmonary_clearance=$18, infection_screening=$19, dvt_prophylaxis=$20, overall_status=$21, assessed_by=$22
                WHERE surgery_id=$23`,
                [s.npo_confirmed ? 1 : 0, s.allergies_reviewed ? 1 : 0, s.allergies_notes || '',
                s.medications_reviewed ? 1 : 0, s.medications_notes || '', s.labs_reviewed ? 1 : 0, s.labs_notes || '',
                s.imaging_reviewed ? 1 : 0, s.imaging_notes || '', s.blood_type_confirmed ? 1 : 0, s.blood_reserved ? 1 : 0,
                s.consent_signed ? 1 : 0, s.anesthesia_clearance ? 1 : 0, s.nursing_assessment ? 1 : 0, s.nursing_notes || '',
                s.cardiac_clearance ? 1 : 0, s.cardiac_notes || '', s.pulmonary_clearance ? 1 : 0,
                s.infection_screening ? 1 : 0, s.dvt_prophylaxis ? 1 : 0, overall, req.session.user.name || '', req.params.id]);
        } else {
            await pool.query(`INSERT INTO surgery_preop_assessments (surgery_id, patient_id, npo_confirmed, allergies_reviewed, allergies_notes,
                medications_reviewed, medications_notes, labs_reviewed, labs_notes, imaging_reviewed, imaging_notes,
                blood_type_confirmed, blood_reserved, consent_signed, anesthesia_clearance,
                nursing_assessment, nursing_notes, cardiac_clearance, cardiac_notes,
                pulmonary_clearance, infection_screening, dvt_prophylaxis, overall_status, assessed_by)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`,
                [req.params.id, pid, s.npo_confirmed ? 1 : 0, s.allergies_reviewed ? 1 : 0, s.allergies_notes || '',
                s.medications_reviewed ? 1 : 0, s.medications_notes || '', s.labs_reviewed ? 1 : 0, s.labs_notes || '',
                s.imaging_reviewed ? 1 : 0, s.imaging_notes || '', s.blood_type_confirmed ? 1 : 0, s.blood_reserved ? 1 : 0,
                s.consent_signed ? 1 : 0, s.anesthesia_clearance ? 1 : 0, s.nursing_assessment ? 1 : 0, s.nursing_notes || '',
                s.cardiac_clearance ? 1 : 0, s.cardiac_notes || '', s.pulmonary_clearance ? 1 : 0,
                s.infection_screening ? 1 : 0, s.dvt_prophylaxis ? 1 : 0, overall, req.session.user.name || '']);
        }
        // Update surgery preop_status
        await pool.query('UPDATE surgeries SET preop_status=$1 WHERE id=$2', [overall, req.params.id]);
        res.json((await pool.query('SELECT * FROM surgery_preop_assessments WHERE surgery_id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Pre-op Tests
app.get('/api/surgeries/:id/preop-tests', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM surgery_preop_tests WHERE surgery_id=$1 ORDER BY id', [req.params.id])).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/surgeries/:id/preop-tests', requireAuth, async (req, res) => {
    try {
        const { test_type, test_name, notes } = req.body;
        const surgery = (await pool.query('SELECT patient_id FROM surgeries WHERE id=$1', [req.params.id])).rows[0];
        const result = await pool.query('INSERT INTO surgery_preop_tests (surgery_id, patient_id, test_type, test_name, notes) VALUES ($1,$2,$3,$4,$5) RETURNING id',
            [req.params.id, surgery?.patient_id || 0, test_type || 'Lab', test_name || '', notes || '']);
        res.json((await pool.query('SELECT * FROM surgery_preop_tests WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/surgery-preop-tests/:id', requireAuth, async (req, res) => {
    try {
        const { is_completed, result_summary } = req.body;
        if (is_completed !== undefined) await pool.query('UPDATE surgery_preop_tests SET is_completed=$1 WHERE id=$2', [is_completed ? 1 : 0, req.params.id]);
        if (result_summary) await pool.query('UPDATE surgery_preop_tests SET result_summary=$1 WHERE id=$2', [result_summary, req.params.id]);
        res.json((await pool.query('SELECT * FROM surgery_preop_tests WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Anesthesia Records
app.get('/api/surgeries/:id/anesthesia', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM surgery_anesthesia_records WHERE surgery_id=$1', [req.params.id])).rows[0] || null); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/surgeries/:id/anesthesia', requireAuth, async (req, res) => {
    try {
        const a = req.body;
        const surgery = (await pool.query('SELECT patient_id FROM surgeries WHERE id=$1', [req.params.id])).rows[0];
        const existing = (await pool.query('SELECT id FROM surgery_anesthesia_records WHERE surgery_id=$1', [req.params.id])).rows[0];
        if (existing) {
            await pool.query(`UPDATE surgery_anesthesia_records SET anesthetist_name=$1, asa_class=$2, anesthesia_type=$3,
                airway_assessment=$4, mallampati_score=$5, premedication=$6, induction_agents=$7, maintenance_agents=$8,
                muscle_relaxants=$9, monitors_used=$10, iv_access=$11, fluid_given=$12, blood_loss_ml=$13,
                complications=$14, recovery_notes=$15, notes=$16 WHERE surgery_id=$17`,
                [a.anesthetist_name || '', a.asa_class || 'ASA I', a.anesthesia_type || 'General',
                a.airway_assessment || '', a.mallampati_score || '', a.premedication || '', a.induction_agents || '',
                a.maintenance_agents || '', a.muscle_relaxants || '', a.monitors_used || '', a.iv_access || '',
                a.fluid_given || '', a.blood_loss_ml || 0, a.complications || '', a.recovery_notes || '', a.notes || '', req.params.id]);
        } else {
            await pool.query(`INSERT INTO surgery_anesthesia_records (surgery_id, patient_id, anesthetist_name, asa_class, anesthesia_type,
                airway_assessment, mallampati_score, premedication, induction_agents, maintenance_agents,
                muscle_relaxants, monitors_used, iv_access, fluid_given, blood_loss_ml,
                complications, recovery_notes, notes)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
                [req.params.id, surgery?.patient_id || 0, a.anesthetist_name || '', a.asa_class || 'ASA I', a.anesthesia_type || 'General',
                a.airway_assessment || '', a.mallampati_score || '', a.premedication || '', a.induction_agents || '',
                a.maintenance_agents || '', a.muscle_relaxants || '', a.monitors_used || '', a.iv_access || '',
                a.fluid_given || '', a.blood_loss_ml || 0, a.complications || '', a.recovery_notes || '', a.notes || '']);
        }
        res.json((await pool.query('SELECT * FROM surgery_anesthesia_records WHERE surgery_id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Operating Rooms
app.get('/api/operating-rooms', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM operating_rooms ORDER BY id')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/operating-rooms', requireAuth, async (req, res) => {
    try {
        const { room_name, room_name_ar, location, equipment } = req.body;
        const result = await pool.query('INSERT INTO operating_rooms (room_name, room_name_ar, location, equipment) VALUES ($1,$2,$3,$4) RETURNING id',
            [room_name || '', room_name_ar || '', location || '', equipment || '']);
        res.json((await pool.query('SELECT * FROM operating_rooms WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== BLOOD BANK =====
app.get('/api/blood-bank/units', requireAuth, async (req, res) => {
    try {
        const { status, blood_type } = req.query;
        let q = 'SELECT * FROM blood_bank_units'; const params = []; const conds = [];
        if (status) { params.push(status); conds.push(`status=$${params.length}`); }
        if (blood_type) { params.push(blood_type); conds.push(`blood_type=$${params.length}`); }
        if (conds.length) q += ' WHERE ' + conds.join(' AND ');
        q += ' ORDER BY id DESC';
        res.json((await pool.query(q, params)).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/blood-bank/units', requireAuth, async (req, res) => {
    try {
        const { bag_number, blood_type, rh_factor, component, donor_id, collection_date, expiry_date, volume_ml, storage_location, notes } = req.body;
        const result = await pool.query(
            'INSERT INTO blood_bank_units (bag_number, blood_type, rh_factor, component, donor_id, collection_date, expiry_date, volume_ml, storage_location, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id',
            [bag_number || '', blood_type || '', rh_factor || '+', component || 'Whole Blood', donor_id || 0, collection_date || '', expiry_date || '', volume_ml || 450, storage_location || '', notes || '']);
        res.json((await pool.query('SELECT * FROM blood_bank_units WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/blood-bank/units/:id', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        if (status) await pool.query('UPDATE blood_bank_units SET status=$1 WHERE id=$2', [status, req.params.id]);
        res.json((await pool.query('SELECT * FROM blood_bank_units WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/blood-bank/donors', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM blood_bank_donors ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/blood-bank/donors', requireAuth, async (req, res) => {
    try {
        const { donor_name, donor_name_ar, national_id, phone, blood_type, rh_factor, age, gender, medical_history, notes } = req.body;
        const result = await pool.query(
            'INSERT INTO blood_bank_donors (donor_name, donor_name_ar, national_id, phone, blood_type, rh_factor, age, gender, last_donation_date, medical_history, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_DATE::TEXT,$9,$10) RETURNING id',
            [donor_name || '', donor_name_ar || '', national_id || '', phone || '', blood_type || '', rh_factor || '+', age || 0, gender || '', medical_history || '', notes || '']);
        res.json((await pool.query('SELECT * FROM blood_bank_donors WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/blood-bank/crossmatch', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, patient_blood_type, units_needed, unit_id, surgery_id, notes } = req.body;
        const result = await pool.query(
            'INSERT INTO blood_bank_crossmatch (patient_id, patient_name, patient_blood_type, units_needed, unit_id, lab_technician, surgery_id, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
            [patient_id || 0, patient_name || '', patient_blood_type || '', units_needed || 1, unit_id || 0, req.session.user.name || '', surgery_id || 0, notes || '']);
        res.json((await pool.query('SELECT * FROM blood_bank_crossmatch WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/blood-bank/crossmatch', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM blood_bank_crossmatch ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/blood-bank/crossmatch/:id', requireAuth, async (req, res) => {
    try {
        const { result: matchResult } = req.body;
        if (matchResult) await pool.query('UPDATE blood_bank_crossmatch SET result=$1 WHERE id=$2', [matchResult, req.params.id]);
        res.json((await pool.query('SELECT * FROM blood_bank_crossmatch WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/blood-bank/transfusions', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM blood_bank_transfusions ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/blood-bank/transfusions', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, unit_id, bag_number, blood_type, component, administered_by, start_time, volume_ml, notes } = req.body;
        // Mark unit as Used
        if (unit_id) await pool.query("UPDATE blood_bank_units SET status='Used' WHERE id=$1", [unit_id]);
        const result = await pool.query(
            'INSERT INTO blood_bank_transfusions (patient_id, patient_name, unit_id, bag_number, blood_type, component, administered_by, start_time, volume_ml, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id',
            [patient_id || 0, patient_name || '', unit_id || 0, bag_number || '', blood_type || '', component || '', administered_by || req.session.user.name || '', start_time || new Date().toISOString(), volume_ml || 0, notes || '']);
        res.json((await pool.query('SELECT * FROM blood_bank_transfusions WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/blood-bank/stats', requireAuth, async (req, res) => {
    try {
        const total = (await pool.query("SELECT COUNT(*) as cnt FROM blood_bank_units WHERE status='Available'")).rows[0].cnt;
        const expiring = (await pool.query("SELECT COUNT(*) as cnt FROM blood_bank_units WHERE status='Available' AND expiry_date != '' AND expiry_date <= (CURRENT_DATE + INTERVAL '7 days')::TEXT")).rows[0].cnt;
        const todayTransfusions = (await pool.query("SELECT COUNT(*) as cnt FROM blood_bank_transfusions WHERE created_at::date = CURRENT_DATE")).rows[0].cnt;
        const byType = (await pool.query("SELECT blood_type, rh_factor, COUNT(*) as cnt FROM blood_bank_units WHERE status='Available' GROUP BY blood_type, rh_factor ORDER BY blood_type")).rows;
        const totalDonors = (await pool.query('SELECT COUNT(*) as cnt FROM blood_bank_donors')).rows[0].cnt;
        const pendingCrossmatch = (await pool.query("SELECT COUNT(*) as cnt FROM blood_bank_crossmatch WHERE result='Pending'")).rows[0].cnt;
        res.json({ total, expiring, todayTransfusions, byType, totalDonors, pendingCrossmatch });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== CONSENT FORMS =====
app.get('/api/consent-forms', requireAuth, async (req, res) => {
    try {
        const { patient_id } = req.query;
        if (patient_id) { res.json((await pool.query('SELECT * FROM consent_forms WHERE patient_id=$1 ORDER BY id DESC', [patient_id])).rows); }
        else { res.json((await pool.query('SELECT * FROM consent_forms ORDER BY id DESC')).rows); }
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/consent-forms', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, form_type, form_title, form_title_ar, content, doctor_name, surgery_id, notes } = req.body;
        const result = await pool.query(
            'INSERT INTO consent_forms (patient_id, patient_name, form_type, form_title, form_title_ar, content, doctor_name, surgery_id, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id',
            [patient_id || 0, patient_name || '', form_type || 'general', form_title || '', form_title_ar || '', content || '', doctor_name || req.session.user.name || '', surgery_id || 0, notes || '']);
        res.json((await pool.query('SELECT * FROM consent_forms WHERE id=$1', [result.rows[0].id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/consent-forms/:id', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM consent_forms WHERE id=$1', [req.params.id])).rows[0]); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/consent-forms/:id/sign', requireAuth, async (req, res) => {
    try {
        const { patient_signature, witness_name, witness_signature } = req.body;
        await pool.query("UPDATE consent_forms SET patient_signature=$1, witness_name=$2, witness_signature=$3, signed_at=NOW()::TEXT, status='Signed' WHERE id=$4",
            [patient_signature || '', witness_name || '', witness_signature || '', req.params.id]);
        res.json((await pool.query('SELECT * FROM consent_forms WHERE id=$1', [req.params.id])).rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/consent-forms/templates/list', requireAuth, async (req, res) => {
    try {
        res.json([
            { type: 'surgical', title: 'Surgical Consent', title_ar: 'إقرار عملية جراحية', file: '25_إقرار_عملية_جراحية_عامة_Surgical_Consent.html', content: 'أقر أنا الموقع أدناه بموافقتي على إجراء العملية الجراحية الموضحة في هذا النموذج، وقد تم شرح طبيعة العملية والمضاعفات المحتملة والبدائل العلاجية المتاحة لي بالتفصيل.' },
            { type: 'anesthesia', title: 'Anesthesia Consent', title_ar: 'إقرار تخدير', file: '26_إقرار_تخدير_Anesthesia_Consent.html', content: 'أقر بموافقتي على إجراء التخدير اللازم للعملية، وقد تم إبلاغي بنوع التخدير المقترح والمخاطر المحتملة بما في ذلك الحساسية وصعوبة التنفس.' },
            { type: 'admission', title: 'Admission Consent', title_ar: 'إقرار قبول ودخول', file: '27_إقرار_قبول_ودخول_Admission_Consent.html', content: 'أقر بموافقتي على الدخول للمستشفى وتلقي العلاج اللازم، وأوافق على اتباع التعليمات واللوائح الداخلية للمستشفى.' },
            { type: 'blood_transfusion', title: 'Blood Transfusion Consent', title_ar: 'إقرار نقل دم', file: '28_إقرار_نقل_دم_Blood_Transfusion_Consent.html', content: 'أقر بموافقتي على إجراء نقل الدم أو مشتقاته حسب الحالة الطبية، وقد تم إعلامي بالمخاطر المحتملة بما في ذلك ردود الفعل التحسسية.' },
            { type: 'treatment_refusal', title: 'Treatment Refusal', title_ar: 'إقرار رفض علاج', file: '29_إقرار_رفض_علاج_Treatment_Refusal.html', content: 'أقر أنني قررت رفض العلاج/الإجراء الطبي الموصى به رغم شرح الطبيب للمخاطر المترتبة على ذلك، وأتحمل كامل المسؤولية.' },
            { type: 'medical_photography', title: 'Medical Photography Consent', title_ar: 'إقرار تصوير طبي', file: '19_إقرار_نشر_الصور_Social_Media_Photo_Consent.html', content: 'أوافق على التقاط صور/فيديو للحالة الطبية لأغراض التوثيق الطبي والتعليم والبحث العلمي، مع الحفاظ على السرية.' },
            { type: 'ama_discharge', title: 'Discharge Against Medical Advice', title_ar: 'إقرار خروج ضد المشورة الطبية', file: '30_إقرار_خروج_ضد_المشورة_AMA_Discharge.html', content: 'أقر بأنني أرغب بالخروج من المستشفى ضد المشورة الطبية، وقد تم إعلامي بالمخاطر المحتملة، وأتحمل كامل المسؤولية.' },
            { type: 'privacy', title: 'Privacy Policy Consent', title_ar: 'إقرار سياسة الخصوصية', file: '31_إقرار_سياسة_الخصوصية_Privacy_Policy_Consent.html', content: 'أوافق على سياسة الخصوصية وحماية البيانات الشخصية، وأجيز للمستشفى استخدام بياناتي الطبية وفقاً للأنظمة واللوائح المعمول بها.' },
            // ===== COSMETIC / DERMATOLOGY CONSENT TEMPLATES =====
            { type: 'cosmetic_general', title: 'General Cosmetic Surgery Consent', title_ar: 'إقرار جراحة تجميلية عام', file: '01_إقرار_جراحة_تجميلية_عام_General_Cosmetic_Consent.html', content: 'أقر أنا الموقع أدناه بموافقتي على إجراء العملية التجميلية الموضحة.' },
            { type: 'rhinoplasty', title: 'Rhinoplasty Consent', title_ar: 'إقرار تجميل الأنف', file: '02_إقرار_تجميل_الأنف_Rhinoplasty_Consent.html', content: 'أقر بموافقتي على عملية تجميل الأنف.' },
            { type: 'botox_filler', title: 'Botox & Filler Consent', title_ar: 'إقرار بوتوكس وفيلر', file: '03_إقرار_بوتوكس_وفيلر_Botox_Filler_Consent.html', content: 'أقر بموافقتي على حقن البوتوكس/الفيلر.' },
            { type: 'liposuction', title: 'Liposuction / Body Contouring Consent', title_ar: 'إقرار شفط الدهون وشد البطن', file: '04_إقرار_شفط_دهون_وشد_بطن_Liposuction_Consent.html', content: 'أقر بموافقتي على عملية نحت الجسم.' },
            { type: 'laser_treatment', title: 'Laser Treatment Consent', title_ar: 'إقرار علاج ليزر', file: '05_إقرار_علاج_ليزر_Laser_Treatment_Consent.html', content: 'أقر بموافقتي على العلاج بالليزر.' },
            { type: 'hair_transplant', title: 'Hair Transplant Consent', title_ar: 'إقرار زراعة الشعر', file: '06_إقرار_زراعة_شعر_Hair_Transplant_Consent.html', content: 'أقر بموافقتي على زراعة الشعر.' },
            { type: 'chemical_peeling', title: 'Chemical Peeling Consent', title_ar: 'إقرار التقشير الكيميائي', file: '07_إقرار_التقشير_الكيميائي_Chemical_Peeling_Consent.html', content: 'أقر بموافقتي على التقشير الكيميائي.' },
            { type: 'hair_bleaching', title: 'Hair Bleaching Consent', title_ar: 'إقرار تشقير الشعر', file: '08_إقرار_تشقير_الشعر_Hair_Bleaching_Consent.html', content: 'أقر بموافقتي على تشقير الشعر.' },
            { type: 'hyaluronidase', title: 'Hyaluronidase (Filler Dissolution) Consent', title_ar: 'إقرار إذابة الفيلر', file: '09_إقرار_إذابة_الفيلر_Hyaluronidase_Consent.html', content: 'أقر بموافقتي على إذابة الفيلر بالهيالورونيداز.' },
            { type: 'steroid_injection', title: 'Steroid Injection Consent', title_ar: 'إقرار حقن الكورتيزون', file: '10_إقرار_حقن_الكورتيزون_Steroid_Injection_Consent.html', content: 'أقر بموافقتي على حقن الكورتيزون.' },
            { type: 'lip_rejuvenation', title: 'Lip Rejuvenation Consent', title_ar: 'إقرار توريد الشفايف', file: '11_إقرار_توريد_الشفايف_Lip_Rejuvenation_Consent.html', content: 'أقر بموافقتي على توريد الشفايف.' },
            { type: 'q_switched_laser', title: 'Q-Switched / Carbon Laser Consent', title_ar: 'إقرار الليزر الكربوني', file: '12_إقرار_الليزر_الكربوني_Q_Switched_Laser_Consent.html', content: 'أقر بموافقتي على الليزر الكربوني (Q-Switched).' },
            { type: 'sculptra', title: 'Sculptra (PLLA) Consent', title_ar: 'إقرار سكلبترا', file: '13_إقرار_سكلبترا_Sculptra_Consent.html', content: 'أقر بموافقتي على حقن سكلبترا.' },
            { type: 'skin_tags_removal', title: 'Skin Tags / Moles Removal Consent', title_ar: 'إقرار إزالة الزوائد الجلدية', file: '14_إقرار_إزالة_الزوائد_الجلدية_Skin_Tags_Removal_Consent.html', content: 'أقر بموافقتي على إزالة الزوائد الجلدية.' },
            { type: 'tattoo_removal', title: 'Tattoo Removal Consent', title_ar: 'إقرار إزالة الوشم', file: '15_إقرار_إزالة_الوشم_Tattoo_Removal_Consent.html', content: 'أقر بموافقتي على إزالة الوشم بالليزر.' },
            { type: 'fractional_laser', title: 'Fractional Laser Consent', title_ar: 'إقرار ليزر الفراكشنال', file: '16_إقرار_ليزر_الفراكشنال_Fractional_Laser_Consent.html', content: 'أقر بموافقتي على ليزر الفراكشنال.' },
            { type: 'dermapen_scarlet', title: 'Dermapen / Scarlet RF + PRP Consent', title_ar: 'إقرار الديرمابن / سكارليت مع البلازما', file: '17_إقرار_الديرمابن_سكارليت_Dermapen_Scarlet_Consent.html', content: 'أقر بموافقتي على الميكرونيدلينغ.' },
            { type: 'roaccutane', title: 'Roaccutane (Isotretinoin) Consent', title_ar: 'إقرار الرواكتان', file: '18_إقرار_الرواكتان_Roaccutane_Consent.html', content: 'أقر بموافقتي على علاج الآيزوتريتينوين.' },
            { type: 'social_media_photo', title: 'Social Media Photo/Video Consent', title_ar: 'إقرار نشر الصور على التواصل الاجتماعي', file: '19_إقرار_نشر_الصور_Social_Media_Photo_Consent.html', content: 'أوافق طوعياً على التصوير والنشر على التواصل الاجتماعي.' },
            { type: 'glow_sessions', title: 'Glow / Rejuvenation Sessions Consent', title_ar: 'إقرار جلسات النضارة', file: '20_إقرار_جلسات_النضارة_Glow_Sessions_Consent.html', content: 'أقر بموافقتي على جلسة النضارة.' },
            { type: 'general_medical', title: 'General Medical Procedure Consent', title_ar: 'إقرار إجراء طبي عام', file: '21_إقرار_إجراء_طبي_عام_General_Medical_Procedure_Consent.html', content: 'أقر بموافقتي على الإجراء الطبي.' },
            { type: 'injection_info', title: 'Injection Info Card', title_ar: 'بطاقة معلومات الحقن', file: '22_بطاقة_معلومات_الحقن_Injection_Info_Card.html', content: 'بطاقة معلومات الحقن.' },
            { type: 'mesotherapy', title: 'General Mesotherapy Consent', title_ar: 'إقرار الميزوثيرابي', file: '23_إقرار_الميزوثيرابي_General_Mesotherapy_Consent.html', content: 'أقر بموافقتي على الميزوثيرابي.' },
            { type: 'cosmetic_info_card', title: 'Cosmetic Procedures Info Card', title_ar: 'بطاقة معلومات إجراءات التجميل', file: '24_نموذج_بطاقة_معلومات_إجراءات_التجميل_Cosmetic_Info_Card.html', content: 'بطاقة معلومات إجراءات التجميل.' }
        ]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== CONSENT FORM HTML RENDERER (Auto-fill patient data) =====
app.get('/api/consent-forms/render/:type', requireAuth, async (req, res) => {
    try {
        const { patient_id, doctor_name } = req.query;
        // Get template file mapping
        const templatesResp = await new Promise((resolve) => {
            const templates = [
                { type: 'surgical', file: '25_إقرار_عملية_جراحية_عامة_Surgical_Consent.html' },
                { type: 'anesthesia', file: '26_إقرار_تخدير_Anesthesia_Consent.html' },
                { type: 'admission', file: '27_إقرار_قبول_ودخول_Admission_Consent.html' },
                { type: 'blood_transfusion', file: '28_إقرار_نقل_دم_Blood_Transfusion_Consent.html' },
                { type: 'treatment_refusal', file: '29_إقرار_رفض_علاج_Treatment_Refusal.html' },
                { type: 'medical_photography', file: '19_إقرار_نشر_الصور_Social_Media_Photo_Consent.html' },
                { type: 'ama_discharge', file: '30_إقرار_خروج_ضد_المشورة_AMA_Discharge.html' },
                { type: 'privacy', file: '31_إقرار_سياسة_الخصوصية_Privacy_Policy_Consent.html' },
                { type: 'cosmetic_general', file: '01_إقرار_جراحة_تجميلية_عام_General_Cosmetic_Consent.html' },
                { type: 'rhinoplasty', file: '02_إقرار_تجميل_الأنف_Rhinoplasty_Consent.html' },
                { type: 'botox_filler', file: '03_إقرار_بوتوكس_وفيلر_Botox_Filler_Consent.html' },
                { type: 'liposuction', file: '04_إقرار_شفط_دهون_وشد_بطن_Liposuction_Consent.html' },
                { type: 'laser_treatment', file: '05_إقرار_علاج_ليزر_Laser_Treatment_Consent.html' },
                { type: 'hair_transplant', file: '06_إقرار_زراعة_شعر_Hair_Transplant_Consent.html' },
                { type: 'chemical_peeling', file: '07_إقرار_التقشير_الكيميائي_Chemical_Peeling_Consent.html' },
                { type: 'hair_bleaching', file: '08_إقرار_تشقير_الشعر_Hair_Bleaching_Consent.html' },
                { type: 'hyaluronidase', file: '09_إقرار_إذابة_الفيلر_Hyaluronidase_Consent.html' },
                { type: 'steroid_injection', file: '10_إقرار_حقن_الكورتيزون_Steroid_Injection_Consent.html' },
                { type: 'lip_rejuvenation', file: '11_إقرار_توريد_الشفايف_Lip_Rejuvenation_Consent.html' },
                { type: 'q_switched_laser', file: '12_إقرار_الليزر_الكربوني_Q_Switched_Laser_Consent.html' },
                { type: 'sculptra', file: '13_إقرار_سكلبترا_Sculptra_Consent.html' },
                { type: 'skin_tags_removal', file: '14_إقرار_إزالة_الزوائد_الجلدية_Skin_Tags_Removal_Consent.html' },
                { type: 'tattoo_removal', file: '15_إقرار_إزالة_الوشم_Tattoo_Removal_Consent.html' },
                { type: 'fractional_laser', file: '16_إقرار_ليزر_الفراكشنال_Fractional_Laser_Consent.html' },
                { type: 'dermapen_scarlet', file: '17_إقرار_الديرمابن_سكارليت_Dermapen_Scarlet_Consent.html' },
                { type: 'roaccutane', file: '18_إقرار_الرواكتان_Roaccutane_Consent.html' },
                { type: 'social_media_photo', file: '19_إقرار_نشر_الصور_Social_Media_Photo_Consent.html' },
                { type: 'glow_sessions', file: '20_إقرار_جلسات_النضارة_Glow_Sessions_Consent.html' },
                { type: 'general_medical', file: '21_إقرار_إجراء_طبي_عام_General_Medical_Procedure_Consent.html' },
                { type: 'injection_info', file: '22_بطاقة_معلومات_الحقن_Injection_Info_Card.html' },
                { type: 'mesotherapy', file: '23_إقرار_الميزوثيرابي_General_Mesotherapy_Consent.html' },
                { type: 'cosmetic_info_card', file: '24_نموذج_بطاقة_معلومات_إجراءات_التجميل_Cosmetic_Info_Card.html' }
            ];
            resolve(templates.find(t => t.type === req.params.type));
        });
        if (!templatesResp) return res.status(404).json({ error: 'Template not found' });
        const filePath = path.join(__dirname, 'public', 'consent-forms', templatesResp.file);
        if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'HTML file not found' });
        let html = fs.readFileSync(filePath, 'utf8');
        // Auto-fill patient data if patient_id provided
        if (patient_id) {
            const patient = (await pool.query('SELECT * FROM patients WHERE id=$1', [patient_id])).rows[0];
            if (patient) {
                const now = new Date();
                const dateStr = now.toISOString().split('T')[0];
                const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
                // Calculate age
                let age = '';
                if (patient.dob) {
                    const dob = new Date(patient.dob);
                    age = Math.floor((now - dob) / (365.25 * 24 * 60 * 60 * 1000));
                }
                // Inject auto-fill script at end of body
                const fillScript = `<script>
                    document.addEventListener('DOMContentLoaded', function() {
                        const data = {
                            name: '${(patient.name_ar || patient.name_en || '').replace(/'/g, "\\'")}',
                            fileNo: '${patient.file_number || ''}',
                            idNo: '${patient.national_id || ''}',
                            age: '${age}',
                            phone: '${patient.phone || ''}',
                            date: '${dateStr}',
                            time: '${timeStr}',
                            gender: '${patient.gender || ''}',
                            doctor: '${(doctor_name || '').replace(/'/g, "\\'")}'
                        };
                        // Fill all .line spans after label fields
                        const fields = document.querySelectorAll('.field');
                        fields.forEach(f => {
                            const label = f.querySelector('label');
                            const line = f.querySelector('.line');
                            if (!label || !line) return;
                            const txt = label.textContent;
                            if (txt.includes('اسم المريض') || txt.includes('Name:')) line.textContent = data.name;
                            else if (txt.includes('رقم الملف') || txt.includes('File')) line.textContent = data.fileNo;
                            else if (txt.includes('رقم الهوية') || txt.includes('ID #')) line.textContent = data.idNo;
                            else if (txt.includes('العمر') || txt.includes('Age')) line.textContent = data.age;
                            else if (txt.includes('الجوال') || txt.includes('Phone')) line.textContent = data.phone;
                            else if (txt.includes('التاريخ') || txt.includes('Date:')) line.textContent = data.date;
                            else if (txt.includes('الوقت') || txt.includes('Time:')) line.textContent = data.time;
                            else if ((txt.includes('الجراح') || txt.includes('Surgeon') || txt.includes('الطبيب المعالج') || txt.includes('طبيب التخدير')) && data.doctor) line.textContent = data.doctor;
                        });
                    });
                </script>`;
                html = html.replace('</body>', fillScript + '\n</body>');
            }
        }
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});


// ===== LAB & RADIOLOGY ORDERS (Payment-First Workflow) =====
// Doctor creates order → status='Pending Payment' → Reception pays → status='Requested' → Lab/Rad processes

// Get lab orders (only paid/approved ones visible to lab)
app.get('/api/lab/orders', requireAuth, async (req, res) => {
    try {
        const rows = (await pool.query(`SELECT o.*, p.name_ar as patient_name, p.file_number, p.phone 
            FROM lab_radiology_orders o LEFT JOIN patients p ON o.patient_id = p.id 
            WHERE o.is_radiology = 0 AND o.approval_status IN ('Approved', 'Paid')
            ORDER BY o.id DESC`)).rows;
        res.json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Get radiology orders (only paid/approved ones visible to radiology)
app.get('/api/radiology/orders', requireAuth, async (req, res) => {
    try {
        const rows = (await pool.query(`SELECT o.*, p.name_ar as patient_name, p.file_number, p.phone 
            FROM lab_radiology_orders o LEFT JOIN patients p ON o.patient_id = p.id 
            WHERE o.is_radiology = 1 AND o.approval_status IN ('Approved', 'Paid')
            ORDER BY o.id DESC`)).rows;
        res.json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Get ALL pending payment orders (for reception)
app.get('/api/orders/pending-payment', requireAuth, async (req, res) => {
    try {
        const rows = (await pool.query(`SELECT o.*, p.name_ar as patient_name, p.name_en, p.file_number, p.phone, p.nationality
            FROM lab_radiology_orders o LEFT JOIN patients p ON o.patient_id = p.id 
            WHERE o.approval_status = 'Pending Approval'
            ORDER BY o.id DESC`)).rows;
        res.json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Doctor creates lab order (goes to reception first)
app.post('/api/lab/orders', requireAuth, async (req, res) => {
    try {
        const { patient_id, order_type, description } = req.body;
        const pName = (await pool.query('SELECT name_ar, name_en FROM patients WHERE id=$1', [patient_id])).rows[0];
        const r = await pool.query(
            `INSERT INTO lab_radiology_orders (patient_id, doctor_id, order_type, description, status, is_radiology, approval_status) 
             VALUES ($1, $2, $3, $4, 'Pending Payment', 0, 'Pending Approval') RETURNING *`,
            [patient_id, req.session.user?.id || 0, order_type || '', description || '']
        );
        r.rows[0].patient_name = pName?.name_ar || pName?.name_en || '';
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Doctor creates radiology order (goes to reception first)
app.post('/api/radiology/orders', requireAuth, async (req, res) => {
    try {
        const { patient_id, order_type, description } = req.body;
        const pName = (await pool.query('SELECT name_ar, name_en FROM patients WHERE id=$1', [patient_id])).rows[0];
        const r = await pool.query(
            `INSERT INTO lab_radiology_orders (patient_id, doctor_id, order_type, description, status, is_radiology, approval_status) 
             VALUES ($1, $2, $3, $4, 'Pending Payment', 1, 'Pending Approval') RETURNING *`,
            [patient_id, req.session.user?.id || 0, order_type || '', description || '']
        );
        r.rows[0].patient_name = pName?.name_ar || pName?.name_en || '';
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Direct lab order (from lab page - auto approved)
app.post('/api/lab/orders/direct', requireAuth, async (req, res) => {
    try {
        const { patient_id, order_type, description } = req.body;
        const pName = patient_id ? (await pool.query('SELECT name_ar, name_en FROM patients WHERE id=$1', [patient_id])).rows[0] : null;
        const r = await pool.query(
            `INSERT INTO lab_radiology_orders (patient_id, doctor_id, order_type, description, status, is_radiology, approval_status) 
             VALUES ($1, $2, $3, $4, 'Requested', 0, 'Paid') RETURNING *`,
            [patient_id || 0, req.session.user?.id || 0, order_type || '', description || '']
        );
        r.rows[0].patient_name = pName?.name_ar || pName?.name_en || '';
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Reception approves payment → order goes to Lab/Radiology
app.put('/api/orders/:id/approve-payment', requireAuth, async (req, res) => {
    try {
        const { payment_method, price } = req.body;
        // Update order status
        await pool.query(
            `UPDATE lab_radiology_orders SET status='Requested', approval_status='Paid', approved_by=$1, price=$2 WHERE id=$3`,
            [req.session.user?.display_name || 'Reception', price || 0, req.params.id]
        );
        // Get order details for invoice
        const order = (await pool.query(`SELECT o.*, p.name_ar, p.name_en, p.nationality 
            FROM lab_radiology_orders o LEFT JOIN patients p ON o.patient_id = p.id WHERE o.id=$1`, [req.params.id])).rows[0];
        if (order && price > 0) {
            // Calculate VAT for non-Saudi patients
            const vat = await calcVAT(order.patient_id);
            const { total: finalTotal, vatAmount } = addVAT(price, vat.rate);
            const serviceType = order.is_radiology ? 'Radiology' : 'Laboratory';
            const desc = `${serviceType}: ${order.order_type}`;
            await pool.query(
                `INSERT INTO invoices (patient_id, patient_name, total, amount, vat_amount, description, service_type, paid, payment_method, order_id) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8, $9)`,
                [order.patient_id, order.name_ar || order.name_en || '', finalTotal, price, vatAmount, desc, serviceType, payment_method || 'Cash', order.id]
            );
        }
        res.json({ success: true, order });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Update lab/radiology order status (In Progress, Done)
app.put('/api/lab/orders/:id', requireAuth, async (req, res) => {
    try {
        const { status, results } = req.body;
        const sets = []; const vals = []; let i = 1;
        if (status) { sets.push(`status=$${i++}`); vals.push(status); }
        if (results !== undefined) { sets.push(`results=$${i++}`); vals.push(results); }
        if (status === 'Done') { sets.push(`result_date=$${i++}`); vals.push(new Date().toISOString()); }
        vals.push(req.params.id);
        await pool.query(`UPDATE lab_radiology_orders SET ${sets.join(',')} WHERE id=$${i}`, vals);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Get single order
app.get('/api/lab/orders/:id', requireAuth, async (req, res) => {
    try {
        const r = (await pool.query(`SELECT o.*, p.name_ar as patient_name, p.file_number 
            FROM lab_radiology_orders o LEFT JOIN patients p ON o.patient_id = p.id WHERE o.id=$1`, [req.params.id])).rows[0];
        res.json(r || {});
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Get patient's lab/radiology results
app.get('/api/patient/:pid/results', requireAuth, async (req, res) => {
    try {
        const rows = (await pool.query(`SELECT * FROM lab_radiology_orders WHERE patient_id=$1 AND approval_status IN ('Approved','Paid') ORDER BY id DESC`, [req.params.pid])).rows;
        res.json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== EMERGENCY DEPARTMENT =====
app.get('/api/emergency/visits', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM emergency_visits ORDER BY arrival_time DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/emergency/visits', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, arrival_mode, chief_complaint, chief_complaint_ar, triage_level, triage_color, triage_nurse, triage_vitals, assigned_doctor, assigned_bed, acuity_notes } = req.body;
        const r = await pool.query('INSERT INTO emergency_visits (patient_id,patient_name,arrival_mode,chief_complaint,chief_complaint_ar,triage_level,triage_color,triage_nurse,triage_vitals,assigned_doctor,assigned_bed,acuity_notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',
            [patient_id, patient_name, arrival_mode || 'Walk-in', chief_complaint, chief_complaint_ar, triage_level || 3, triage_color || 'Yellow', triage_nurse, triage_vitals, assigned_doctor, assigned_bed, acuity_notes]);
        if (assigned_bed) await pool.query("UPDATE emergency_beds SET status='Occupied', current_patient_id=$1 WHERE bed_name=$2", [patient_id, assigned_bed]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/emergency/visits/:id', requireAuth, async (req, res) => {
    try {
        const { status, disposition, assigned_doctor, assigned_bed, triage_level, triage_color,
            discharge_diagnosis, discharge_instructions, discharge_medications, followup_date } = req.body;
        const sets = []; const vals = []; let i = 1;
        if (status) { sets.push(`status=$${i++}`); vals.push(status); }
        if (disposition) { sets.push(`disposition=$${i++}`); vals.push(disposition); sets.push(`disposition_time=$${i++}`); vals.push(new Date().toISOString()); }
        if (assigned_doctor) { sets.push(`assigned_doctor=$${i++}`); vals.push(assigned_doctor); }
        if (assigned_bed) { sets.push(`assigned_bed=$${i++}`); vals.push(assigned_bed); }
        if (triage_level) { sets.push(`triage_level=$${i++}`); vals.push(triage_level); }
        if (triage_color) { sets.push(`triage_color=$${i++}`); vals.push(triage_color); }
        if (discharge_diagnosis) { sets.push(`discharge_diagnosis=$${i++}`); vals.push(discharge_diagnosis); }
        if (discharge_instructions) { sets.push(`discharge_instructions=$${i++}`); vals.push(discharge_instructions); }
        if (discharge_medications) { sets.push(`discharge_medications=$${i++}`); vals.push(discharge_medications); }
        if (followup_date) { sets.push(`followup_date=$${i++}`); vals.push(followup_date); }
        if (status === 'Discharged') { sets.push(`discharge_time=$${i++}`); vals.push(new Date().toISOString()); }
        vals.push(req.params.id);
        await pool.query(`UPDATE emergency_visits SET ${sets.join(',')} WHERE id=$${i}`, vals);
        if (status === 'Discharged' || status === 'Admitted') {
            const v = (await pool.query('SELECT assigned_bed FROM emergency_visits WHERE id=$1', [req.params.id])).rows[0];
            if (v?.assigned_bed) await pool.query("UPDATE emergency_beds SET status='Available', current_patient_id=0 WHERE bed_name=$1", [v.assigned_bed]);
        }
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/emergency/beds', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM emergency_beds ORDER BY id')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/emergency/stats', requireAuth, async (req, res) => {
    try {
        const active = (await pool.query("SELECT COUNT(*) as cnt FROM emergency_visits WHERE status='Active'")).rows[0].cnt;
        const today = (await pool.query("SELECT COUNT(*) as cnt FROM emergency_visits WHERE DATE(arrival_time)=CURRENT_DATE")).rows[0].cnt;
        const critical = (await pool.query("SELECT COUNT(*) as cnt FROM emergency_visits WHERE status='Active' AND triage_level<=2")).rows[0].cnt;
        const beds = (await pool.query("SELECT COUNT(*) as total, COUNT(*) FILTER(WHERE status='Available') as available FROM emergency_beds")).rows[0];
        const byTriage = (await pool.query("SELECT triage_color, COUNT(*) as cnt FROM emergency_visits WHERE status='Active' GROUP BY triage_color")).rows;
        res.json({ active, today, critical, totalBeds: beds.total, availableBeds: beds.available, byTriage });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/emergency/trauma/:visitId', requireAuth, async (req, res) => {
    try {
        const { patient_id, airway, breathing, circulation, disability, exposure, gcs_eye, gcs_verbal, gcs_motor, mechanism_of_injury, trauma_team_activated, assessed_by } = req.body;
        const gcs_total = (parseInt(gcs_eye) || 4) + (parseInt(gcs_verbal) || 5) + (parseInt(gcs_motor) || 6);
        const r = await pool.query('INSERT INTO emergency_trauma_assessments (visit_id,patient_id,airway,breathing,circulation,disability,exposure,gcs_eye,gcs_verbal,gcs_motor,gcs_total,mechanism_of_injury,trauma_team_activated,assessed_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *',
            [req.params.visitId, patient_id, airway, breathing, circulation, disability, exposure, gcs_eye || 4, gcs_verbal || 5, gcs_motor || 6, gcs_total, mechanism_of_injury, trauma_team_activated ? 1 : 0, assessed_by]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== INPATIENT ADT =====
app.get('/api/wards', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM wards ORDER BY id')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/beds', requireAuth, async (req, res) => {
    try {
        const { ward_id } = req.query;
        const q = ward_id ? await pool.query('SELECT b.*, w.ward_name, w.ward_name_ar FROM beds b JOIN wards w ON b.ward_id=w.id WHERE b.ward_id=$1 ORDER BY b.bed_number', [ward_id])
            : await pool.query('SELECT b.*, w.ward_name, w.ward_name_ar FROM beds b JOIN wards w ON b.ward_id=w.id ORDER BY w.id, b.bed_number');
        res.json(q.rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/beds/census', requireAuth, async (req, res) => {
    try {
        const wards = (await pool.query('SELECT * FROM wards ORDER BY id')).rows;
        const beds = (await pool.query('SELECT b.*, w.ward_name, w.ward_name_ar, a.patient_name, a.diagnosis, a.admission_date, a.attending_doctor FROM beds b JOIN wards w ON b.ward_id=w.id LEFT JOIN admissions a ON b.current_admission_id=a.id AND a.status=\'Active\' ORDER BY w.id, b.bed_number')).rows;
        const total = beds.length; const occupied = beds.filter(b => b.status === 'Occupied').length;
        res.json({ wards, beds, total, occupied, available: total - occupied, occupancyRate: total > 0 ? Math.round(occupied / total * 100) : 0 });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/admissions', requireAuth, async (req, res) => {
    try {
        const { status } = req.query;
        const q = status ? await pool.query('SELECT * FROM admissions WHERE status=$1 ORDER BY admission_date DESC', [status])
            : await pool.query('SELECT * FROM admissions ORDER BY admission_date DESC');
        res.json(q.rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/admissions', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, admission_type, admitting_doctor, attending_doctor, department, ward_id, bed_id, diagnosis, icd10_code, admission_orders, diet_order, activity_level, dvt_prophylaxis, expected_los, insurance_auth } = req.body;
        const r = await pool.query('INSERT INTO admissions (patient_id,patient_name,admission_type,admitting_doctor,attending_doctor,department,ward_id,bed_id,diagnosis,icd10_code,admission_orders,diet_order,activity_level,dvt_prophylaxis,expected_los,insurance_auth) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *',
            [patient_id, patient_name, admission_type || 'Regular', admitting_doctor, attending_doctor, department, ward_id, bed_id, diagnosis, icd10_code, admission_orders, diet_order || 'Regular', activity_level || 'Bed Rest', dvt_prophylaxis, expected_los || 3, insurance_auth]);
        if (bed_id) await pool.query("UPDATE beds SET status='Occupied', current_patient_id=$1, current_admission_id=$2 WHERE id=$3", [patient_id, r.rows[0].id, bed_id]);
        await pool.query("UPDATE patients SET status='Admitted' WHERE id=$1", [patient_id]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/admissions/:id/discharge', requireAuth, async (req, res) => {
    try {
        const { discharge_type, discharge_summary, discharge_instructions, discharge_medications, followup_date, followup_doctor } = req.body;
        await pool.query('UPDATE admissions SET status=$1, discharge_date=$2, discharge_type=$3, discharge_summary=$4, discharge_instructions=$5, discharge_medications=$6, followup_date=$7, followup_doctor=$8 WHERE id=$9',
            ['Discharged', new Date().toISOString(), discharge_type || 'Regular', discharge_summary, discharge_instructions, discharge_medications, followup_date, followup_doctor, req.params.id]);
        const adm = (await pool.query('SELECT bed_id, patient_id FROM admissions WHERE id=$1', [req.params.id])).rows[0];
        if (adm?.bed_id) await pool.query("UPDATE beds SET status='Available', current_patient_id=0, current_admission_id=0 WHERE id=$1", [adm.bed_id]);
        if (adm?.patient_id) await pool.query("UPDATE patients SET status='Discharged' WHERE id=$1", [adm.patient_id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/admissions/:id/rounds', requireAuth, async (req, res) => {
    try {
        const { patient_id, doctor_name, subjective, objective, assessment, plan, vitals_summary, orders, diet_changes } = req.body;
        const r = await pool.query('INSERT INTO admission_daily_rounds (admission_id,patient_id,round_date,round_time,doctor_name,subjective,objective,assessment,plan,vitals_summary,orders,diet_changes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',
            [req.params.id, patient_id, new Date().toISOString().split('T')[0], new Date().toTimeString().split(' ')[0], doctor_name, subjective, objective, assessment, plan, vitals_summary, orders, diet_changes]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/admissions/:id/rounds', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM admission_daily_rounds WHERE admission_id=$1 ORDER BY id DESC', [req.params.id])).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/bed-transfers', requireAuth, async (req, res) => {
    try {
        const { admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by } = req.body;
        await pool.query('INSERT INTO bed_transfers (admission_id,patient_id,from_ward,from_bed,to_ward,to_bed,transfer_reason,transferred_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by]);
        if (from_bed) await pool.query("UPDATE beds SET status='Available', current_patient_id=0, current_admission_id=0 WHERE id=$1", [from_bed]);
        if (to_bed) await pool.query("UPDATE beds SET status='Occupied', current_patient_id=$1, current_admission_id=$2 WHERE id=$3", [patient_id, admission_id, to_bed]);
        await pool.query('UPDATE admissions SET ward_id=$1, bed_id=$2 WHERE id=$3', [to_ward, to_bed, admission_id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== ICU =====
app.get('/api/icu/patients', requireAuth, async (req, res) => {
    try { res.json((await pool.query("SELECT a.*, b.bed_number, w.ward_name, w.ward_name_ar FROM admissions a JOIN beds b ON a.bed_id=b.id JOIN wards w ON a.ward_id=w.id WHERE a.status='Active' AND w.ward_type IN ('ICU','NICU','CCU') ORDER BY a.admission_date DESC")).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/icu/monitoring', requireAuth, async (req, res) => {
    try {
        const { admission_id, patient_id, hr, sbp, dbp, map, rr, spo2, temp, etco2, cvp, fio2, peep, urine_output, notes, recorded_by } = req.body;
        const r = await pool.query('INSERT INTO icu_monitoring (admission_id,patient_id,hr,sbp,dbp,map,rr,spo2,temp,etco2,cvp,fio2,peep,urine_output,notes,recorded_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *',
            [admission_id, patient_id, hr, sbp, dbp, map, rr, spo2, temp, etco2, cvp, fio2, peep, urine_output, notes, recorded_by]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/icu/monitoring/:admissionId', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM icu_monitoring WHERE admission_id=$1 ORDER BY monitor_time DESC LIMIT 50', [req.params.admissionId])).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/icu/ventilator', requireAuth, async (req, res) => {
    try {
        const { admission_id, patient_id, vent_mode, fio2, tidal_volume, respiratory_rate, peep, pip, ie_ratio, ps, ett_size, ett_position, cuff_pressure, notes, recorded_by } = req.body;
        const r = await pool.query('INSERT INTO icu_ventilator (admission_id,patient_id,vent_mode,fio2,tidal_volume,respiratory_rate,peep,pip,ie_ratio,ps,ett_size,ett_position,cuff_pressure,notes,recorded_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *',
            [admission_id, patient_id, vent_mode, fio2 || 21, tidal_volume, respiratory_rate, peep, pip, ie_ratio || '1:2', ps, ett_size, ett_position, cuff_pressure, notes, recorded_by]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/icu/ventilator/:admissionId', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM icu_ventilator WHERE admission_id=$1 ORDER BY created_at DESC LIMIT 20', [req.params.admissionId])).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/icu/scores', requireAuth, async (req, res) => {
    try {
        const { admission_id, patient_id, apache_ii, sofa, gcs, rass, cam_icu, braden, morse_fall, pain_score, calculated_by } = req.body;
        const r = await pool.query('INSERT INTO icu_scores (admission_id,patient_id,score_date,apache_ii,sofa,gcs,rass,cam_icu,braden,morse_fall,pain_score,calculated_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',
            [admission_id, patient_id, new Date().toISOString().split('T')[0], apache_ii || 0, sofa || 0, gcs || 15, rass || 0, cam_icu || 0, braden || 23, morse_fall || 0, pain_score || 0, calculated_by]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/icu/scores/:admissionId', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM icu_scores WHERE admission_id=$1 ORDER BY created_at DESC', [req.params.admissionId])).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/icu/fluid-balance', requireAuth, async (req, res) => {
    try {
        const { admission_id, patient_id, shift, iv_fluids, oral_intake, blood_products, medications_iv, urine, drains, ngt_output, stool, vomit, insensible, recorded_by } = req.body;
        const ti = (parseInt(iv_fluids) || 0) + (parseInt(oral_intake) || 0) + (parseInt(blood_products) || 0) + (parseInt(medications_iv) || 0);
        const to = (parseInt(urine) || 0) + (parseInt(drains) || 0) + (parseInt(ngt_output) || 0) + (parseInt(stool) || 0) + (parseInt(vomit) || 0) + (parseInt(insensible) || 0);
        const r = await pool.query('INSERT INTO icu_fluid_balance (admission_id,patient_id,balance_date,shift,iv_fluids,oral_intake,blood_products,medications_iv,total_intake,urine,drains,ngt_output,stool,vomit,insensible,total_output,net_balance,recorded_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *',
            [admission_id, patient_id, new Date().toISOString().split('T')[0], shift || 'Day', iv_fluids || 0, oral_intake || 0, blood_products || 0, medications_iv || 0, ti, urine || 0, drains || 0, ngt_output || 0, stool || 0, vomit || 0, insensible || 0, to, ti - to, recorded_by]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/icu/fluid-balance/:admissionId', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM icu_fluid_balance WHERE admission_id=$1 ORDER BY created_at DESC', [req.params.admissionId])).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== CSSD =====
app.get('/api/cssd/instruments', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM cssd_instrument_sets ORDER BY id')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/cssd/instruments', requireAuth, async (req, res) => {
    try {
        const { set_name, set_name_ar, set_code, category, instrument_count, instruments_list, department } = req.body;
        const r = await pool.query('INSERT INTO cssd_instrument_sets (set_name,set_name_ar,set_code,category,instrument_count,instruments_list,department) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [set_name, set_name_ar, set_code, category, instrument_count || 0, instruments_list, department]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/cssd/cycles', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM cssd_sterilization_cycles ORDER BY start_time DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/cssd/cycles', requireAuth, async (req, res) => {
    try {
        const { cycle_number, machine_name, cycle_type, temperature, pressure, duration_minutes, operator } = req.body;
        const r = await pool.query('INSERT INTO cssd_sterilization_cycles (cycle_number,machine_name,cycle_type,temperature,pressure,duration_minutes,operator) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [cycle_number, machine_name, cycle_type || 'Steam Autoclave', temperature, pressure, duration_minutes, operator]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/cssd/cycles/:id', requireAuth, async (req, res) => {
    try {
        const { status, bi_test_result, ci_result } = req.body;
        const sets = []; const vals = []; let i = 1;
        if (status) { sets.push(`status=$${i++}`); vals.push(status); if (status === 'Completed') { sets.push(`end_time=$${i++}`); vals.push(new Date().toISOString()); } }
        if (bi_test_result) { sets.push(`bi_test_result=$${i++}`); vals.push(bi_test_result); }
        if (ci_result) { sets.push(`ci_result=$${i++}`); vals.push(ci_result); }
        vals.push(req.params.id);
        await pool.query(`UPDATE cssd_sterilization_cycles SET ${sets.join(',')} WHERE id=$${i}`, vals);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/cssd/load-items', requireAuth, async (req, res) => {
    try {
        const { cycle_id, set_id, set_name, barcode } = req.body;
        const r = await pool.query('INSERT INTO cssd_load_items (cycle_id,set_id,set_name,barcode) VALUES ($1,$2,$3,$4) RETURNING *', [cycle_id, set_id, set_name, barcode]);
        if (set_id) await pool.query("UPDATE cssd_instrument_sets SET status='In Sterilization' WHERE id=$1", [set_id]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/cssd/load-items/:cycleId', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM cssd_load_items WHERE cycle_id=$1', [req.params.cycleId])).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== DIETARY =====
app.get('/api/dietary/orders', requireAuth, async (req, res) => {
    try { res.json((await pool.query("SELECT * FROM diet_orders WHERE status='Active' ORDER BY id DESC")).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/dietary/orders', requireAuth, async (req, res) => {
    try {
        const { admission_id, patient_id, patient_name, diet_type, diet_type_ar, texture, fluid, allergies, restrictions, supplements, ordered_by, meal_preferences, notes } = req.body;
        const r = await pool.query('INSERT INTO diet_orders (admission_id,patient_id,patient_name,diet_type,diet_type_ar,texture,fluid,allergies,restrictions,supplements,ordered_by,meal_preferences,start_date,notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *',
            [admission_id, patient_id, patient_name, diet_type || 'Regular', diet_type_ar || 'عادي', texture || 'Normal', fluid || 'Normal', allergies, restrictions, supplements, ordered_by, meal_preferences, new Date().toISOString().split('T')[0], notes]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/dietary/orders/:id', requireAuth, async (req, res) => {
    try {
        const { diet_type, diet_type_ar, texture, fluid, restrictions, status } = req.body;
        const sets = []; const vals = []; let i = 1;
        if (diet_type) { sets.push(`diet_type=$${i++}`); vals.push(diet_type); }
        if (diet_type_ar) { sets.push(`diet_type_ar=$${i++}`); vals.push(diet_type_ar); }
        if (texture) { sets.push(`texture=$${i++}`); vals.push(texture); }
        if (fluid) { sets.push(`fluid=$${i++}`); vals.push(fluid); }
        if (restrictions) { sets.push(`restrictions=$${i++}`); vals.push(restrictions); }
        if (status) { sets.push(`status=$${i++}`); vals.push(status); }
        vals.push(req.params.id);
        await pool.query(`UPDATE diet_orders SET ${sets.join(',')} WHERE id=$${i}`, vals);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/dietary/meals', requireAuth, async (req, res) => {
    try {
        const { order_id, patient_id, meal_type, meal_date, items, calories } = req.body;
        const r = await pool.query('INSERT INTO diet_meals (order_id,patient_id,meal_type,meal_date,items,calories) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            [order_id, patient_id, meal_type, meal_date || new Date().toISOString().split('T')[0], items, calories || 0]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/dietary/meals/:id/deliver', requireAuth, async (req, res) => {
    try {
        await pool.query('UPDATE diet_meals SET delivered=1, delivered_by=$1 WHERE id=$2', [req.body.delivered_by || '', req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/nutrition/assessments', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM nutrition_assessments ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/nutrition/assessments', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, height_cm, weight_kg, caloric_needs, protein_needs, screening_score, malnutrition_risk, plan, assessed_by } = req.body;
        const bmi = height_cm && weight_kg ? parseFloat((weight_kg / ((height_cm / 100) ** 2)).toFixed(1)) : 0;
        const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
        const r = await pool.query('INSERT INTO nutrition_assessments (patient_id,patient_name,assessment_date,height_cm,weight_kg,bmi,bmi_category,caloric_needs,protein_needs,screening_score,malnutrition_risk,plan,assessed_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',
            [patient_id, patient_name, new Date().toISOString().split('T')[0], height_cm || 0, weight_kg || 0, bmi, cat, caloric_needs || 0, protein_needs || 0, screening_score || 0, malnutrition_risk || 'Low', plan, assessed_by]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== INFECTION CONTROL =====
app.get('/api/infection/surveillance', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM infection_surveillance ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/infection/surveillance', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, infection_type, infection_site, organism, sensitivity, hai_category, device_related, device_type, ward, bed, isolation_type, reported_by, notes } = req.body;
        const r = await pool.query('INSERT INTO infection_surveillance (patient_id,patient_name,infection_type,infection_site,organism,sensitivity,detection_date,hai_category,device_related,device_type,ward,bed,isolation_type,reported_by,notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *',
            [patient_id, patient_name, infection_type, infection_site, organism, sensitivity, new Date().toISOString().split('T')[0], hai_category, device_related ? 1 : 0, device_type, ward, bed, isolation_type, reported_by, notes]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/infection/outbreaks', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM infection_outbreaks ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/infection/outbreaks', requireAuth, async (req, res) => {
    try {
        const { outbreak_name, organism, affected_ward, investigation_notes, control_measures, reported_by } = req.body;
        const r = await pool.query('INSERT INTO infection_outbreaks (outbreak_name,organism,start_date,affected_ward,investigation_notes,control_measures,reported_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [outbreak_name, organism, new Date().toISOString().split('T')[0], affected_ward, investigation_notes, control_measures, reported_by]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/infection/outbreaks/:id', requireAuth, async (req, res) => {
    try {
        const { status, total_cases, control_measures } = req.body;
        const sets = []; const vals = []; let i = 1;
        if (status) { sets.push(`status=$${i++}`); vals.push(status); if (status === 'Resolved') { sets.push(`end_date=$${i++}`); vals.push(new Date().toISOString().split('T')[0]); } }
        if (total_cases !== undefined) { sets.push(`total_cases=$${i++}`); vals.push(total_cases); }
        if (control_measures) { sets.push(`control_measures=$${i++}`); vals.push(control_measures); }
        vals.push(req.params.id);
        await pool.query(`UPDATE infection_outbreaks SET ${sets.join(',')} WHERE id=$${i}`, vals);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/infection/exposures', requireAuth, async (req, res) => {
    try {
        const { employee_id, employee_name, exposure_type, source_patient, body_fluid, ppe_worn, action_taken, followup_date, reported_by } = req.body;
        const r = await pool.query('INSERT INTO employee_exposures (employee_id,employee_name,exposure_type,exposure_date,source_patient,body_fluid,ppe_worn,action_taken,followup_date,reported_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
            [employee_id, employee_name, exposure_type, new Date().toISOString().split('T')[0], source_patient, body_fluid, ppe_worn, action_taken, followup_date, reported_by]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/infection/exposures', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM employee_exposures ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/infection/hand-hygiene', requireAuth, async (req, res) => {
    try {
        const { auditor, department, moments_observed, moments_compliant, notes } = req.body;
        const rate = moments_observed > 0 ? parseFloat((moments_compliant / moments_observed * 100).toFixed(1)) : 0;
        const r = await pool.query('INSERT INTO hand_hygiene_audits (audit_date,auditor,department,moments_observed,moments_compliant,compliance_rate,notes) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [new Date().toISOString().split('T')[0], auditor, department, moments_observed, moments_compliant, rate, notes]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/infection/hand-hygiene', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM hand_hygiene_audits ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/infection/stats', requireAuth, async (req, res) => {
    try {
        const total = (await pool.query('SELECT COUNT(*) as cnt FROM infection_surveillance')).rows[0].cnt;
        const active = (await pool.query("SELECT COUNT(*) as cnt FROM infection_outbreaks WHERE status='Active'")).rows[0].cnt;
        const hai = (await pool.query("SELECT COUNT(*) as cnt FROM infection_surveillance WHERE hai_category != ''")).rows[0].cnt;
        const avgHH = (await pool.query('SELECT COALESCE(AVG(compliance_rate),0) as avg FROM hand_hygiene_audits')).rows[0].avg;
        res.json({ totalInfections: total, activeOutbreaks: active, haiCount: hai, avgHandHygiene: parseFloat(parseFloat(avgHH).toFixed(1)) });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== QUALITY & PATIENT SAFETY =====
app.get('/api/quality/incidents', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM quality_incidents ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/quality/incidents', requireAuth, async (req, res) => {
    try {
        const { incident_type, severity, incident_date, incident_time, department, location, patient_id, patient_name, description, immediate_action, reported_by } = req.body;
        const r = await pool.query('INSERT INTO quality_incidents (incident_type,severity,incident_date,incident_time,department,location,patient_id,patient_name,description,immediate_action,reported_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
            [incident_type, severity || 'Minor', incident_date || new Date().toISOString().split('T')[0], incident_time, department, location, patient_id || 0, patient_name, description, immediate_action, reported_by]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/quality/incidents/:id', requireAuth, async (req, res) => {
    try {
        const { status, assigned_to, root_cause, corrective_action, preventive_action } = req.body;
        const sets = []; const vals = []; let i = 1;
        if (status) { sets.push(`status=$${i++}`); vals.push(status); if (status === 'Closed') { sets.push(`closed_date=$${i++}`); vals.push(new Date().toISOString().split('T')[0]); } }
        if (assigned_to) { sets.push(`assigned_to=$${i++}`); vals.push(assigned_to); }
        if (root_cause) { sets.push(`root_cause=$${i++}`); vals.push(root_cause); }
        if (corrective_action) { sets.push(`corrective_action=$${i++}`); vals.push(corrective_action); }
        if (preventive_action) { sets.push(`preventive_action=$${i++}`); vals.push(preventive_action); }
        vals.push(req.params.id);
        await pool.query(`UPDATE quality_incidents SET ${sets.join(',')} WHERE id=$${i}`, vals);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/quality/satisfaction', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM quality_patient_satisfaction ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/quality/satisfaction', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, department, overall_rating, cleanliness, staff_courtesy, wait_time, communication, pain_management, food_quality, comments, would_recommend } = req.body;
        const r = await pool.query('INSERT INTO quality_patient_satisfaction (patient_id,patient_name,department,survey_date,overall_rating,cleanliness,staff_courtesy,wait_time,communication,pain_management,food_quality,comments,would_recommend) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',
            [patient_id || 0, patient_name, department, new Date().toISOString().split('T')[0], overall_rating, cleanliness, staff_courtesy, wait_time, communication, pain_management, food_quality, comments, would_recommend ? 1 : 0]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/quality/kpis', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM quality_kpis ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/quality/kpis', requireAuth, async (req, res) => {
    try {
        const { kpi_name, kpi_name_ar, category, target_value, actual_value, unit, period, department } = req.body;
        const status = actual_value >= target_value ? 'On Track' : actual_value >= target_value * 0.8 ? 'At Risk' : 'Below Target';
        const r = await pool.query('INSERT INTO quality_kpis (kpi_name,kpi_name_ar,category,target_value,actual_value,unit,period,department,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
            [kpi_name, kpi_name_ar, category, target_value, actual_value, unit || '%', period, department, status]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/quality/stats', requireAuth, async (req, res) => {
    try {
        const open = (await pool.query("SELECT COUNT(*) as cnt FROM quality_incidents WHERE status='Open'")).rows[0].cnt;
        const total = (await pool.query('SELECT COUNT(*) as cnt FROM quality_incidents')).rows[0].cnt;
        const avgSat = (await pool.query('SELECT COALESCE(AVG(overall_rating),0) as avg FROM quality_patient_satisfaction')).rows[0].avg;
        const kpiOnTrack = (await pool.query("SELECT COUNT(*) as cnt FROM quality_kpis WHERE status='On Track'")).rows[0].cnt;
        const kpiTotal = (await pool.query('SELECT COUNT(*) as cnt FROM quality_kpis')).rows[0].cnt;
        res.json({ openIncidents: open, totalIncidents: total, avgSatisfaction: parseFloat(parseFloat(avgSat).toFixed(1)), kpiOnTrack, kpiTotal });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== MAINTENANCE =====
app.get('/api/maintenance/work-orders', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM maintenance_work_orders ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/maintenance/work-orders', requireAuth, async (req, res) => {
    try {
        const { wo_number, request_type, priority, department, location, equipment_id, description, description_ar, requested_by, assigned_to, scheduled_date } = req.body;
        const num = wo_number || `WO-${Date.now().toString().slice(-6)}`;
        const r = await pool.query('INSERT INTO maintenance_work_orders (wo_number,request_type,priority,department,location,equipment_id,description,description_ar,requested_by,assigned_to,scheduled_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
            [num, request_type || 'Corrective', priority || 'Normal', department, location, equipment_id || 0, description, description_ar, requested_by, assigned_to, scheduled_date]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/maintenance/work-orders/:id', requireAuth, async (req, res) => {
    try {
        const { status, assigned_to, resolution, cost } = req.body;
        const sets = []; const vals = []; let i = 1;
        if (status) { sets.push(`status=$${i++}`); vals.push(status); if (status === 'Completed') { sets.push(`completed_date=$${i++}`); vals.push(new Date().toISOString().split('T')[0]); } }
        if (assigned_to) { sets.push(`assigned_to=$${i++}`); vals.push(assigned_to); }
        if (resolution) { sets.push(`resolution=$${i++}`); vals.push(resolution); }
        if (cost !== undefined) { sets.push(`cost=$${i++}`); vals.push(cost); }
        vals.push(req.params.id);
        await pool.query(`UPDATE maintenance_work_orders SET ${sets.join(',')} WHERE id=$${i}`, vals);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/maintenance/equipment', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM maintenance_equipment ORDER BY id')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/maintenance/equipment', requireAuth, async (req, res) => {
    try {
        const { equipment_name, equipment_name_ar, equipment_code, category, manufacturer, model, serial_number, department, location, purchase_date, warranty_end } = req.body;
        const r = await pool.query('INSERT INTO maintenance_equipment (equipment_name,equipment_name_ar,equipment_code,category,manufacturer,model,serial_number,department,location,purchase_date,warranty_end) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
            [equipment_name, equipment_name_ar, equipment_code, category, manufacturer, model, serial_number, department, location, purchase_date, warranty_end]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/maintenance/pm-schedules', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT p.*, e.equipment_name, e.equipment_name_ar FROM maintenance_pm_schedules p LEFT JOIN maintenance_equipment e ON p.equipment_id=e.id ORDER BY p.next_due')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/maintenance/pm-schedules', requireAuth, async (req, res) => {
    try {
        const { equipment_id, pm_type, frequency, next_due, checklist } = req.body;
        const r = await pool.query('INSERT INTO maintenance_pm_schedules (equipment_id,pm_type,frequency,next_due,checklist) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [equipment_id, pm_type, frequency || 'Monthly', next_due, checklist]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/maintenance/stats', requireAuth, async (req, res) => {
    try {
        const open = (await pool.query("SELECT COUNT(*) as cnt FROM maintenance_work_orders WHERE status='Open'")).rows[0].cnt;
        const inProg = (await pool.query("SELECT COUNT(*) as cnt FROM maintenance_work_orders WHERE status='In Progress'")).rows[0].cnt;
        const overdue = (await pool.query("SELECT COUNT(*) as cnt FROM maintenance_pm_schedules WHERE next_due < CURRENT_DATE AND status='Pending'")).rows[0].cnt;
        const totalEquip = (await pool.query("SELECT COUNT(*) as cnt FROM maintenance_equipment WHERE status='Active'")).rows[0].cnt;
        res.json({ openWO: open, inProgressWO: inProg, overduePM: overdue, totalEquipment: totalEquip });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== PATIENT TRANSPORT =====
app.get('/api/transport/requests', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM transport_requests ORDER BY request_time DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/transport/requests', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, from_location, to_location, transport_type, priority, requested_by, special_needs } = req.body;
        const r = await pool.query('INSERT INTO transport_requests (patient_id,patient_name,from_location,to_location,transport_type,priority,requested_by,special_needs) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
            [patient_id, patient_name, from_location, to_location, transport_type || 'Wheelchair', priority || 'Routine', requested_by, special_needs]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/transport/requests/:id', requireAuth, async (req, res) => {
    try {
        const { status, assigned_porter, pickup_time, dropoff_time } = req.body;
        const sets = []; const vals = []; let i = 1;
        if (status) { sets.push(`status=$${i++}`); vals.push(status); }
        if (assigned_porter) { sets.push(`assigned_porter=$${i++}`); vals.push(assigned_porter); }
        if (pickup_time) { sets.push(`pickup_time=$${i++}`); vals.push(pickup_time); }
        if (dropoff_time) { sets.push(`dropoff_time=$${i++}`); vals.push(dropoff_time); }
        vals.push(req.params.id);
        await pool.query(`UPDATE transport_requests SET ${sets.join(',')} WHERE id=$${i}`, vals);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== COSMETIC / PLASTIC SURGERY =====
app.get('/api/cosmetic/procedures', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM cosmetic_procedures WHERE is_active=1 ORDER BY category, name_en')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/cosmetic/cases', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM cosmetic_cases ORDER BY created_at DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/cosmetic/cases', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, procedure_id, procedure_name, surgery_date, surgery_time, anesthesia_type, operating_room, total_cost, pre_op_notes } = req.body;
        const result = await pool.query('INSERT INTO cosmetic_cases (patient_id, patient_name, procedure_id, procedure_name, surgeon, surgery_date, surgery_time, anesthesia_type, operating_room, total_cost, pre_op_notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
            [patient_id, patient_name || '', procedure_id || 0, procedure_name || '', req.session.user.name, surgery_date || '', surgery_time || '', anesthesia_type || 'Local', operating_room || '', total_cost || 0, pre_op_notes || '']);
        logAudit(req.session.user.id, req.session.user.name, 'COSMETIC_CASE', 'Cosmetic Surgery', `New case: ${procedure_name} for ${patient_name}`, req.ip);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/cosmetic/cases/:id', requireAuth, async (req, res) => {
    try {
        const { status, operative_notes, post_op_notes, complications, duration_minutes } = req.body;
        await pool.query('UPDATE cosmetic_cases SET status=$1, operative_notes=$2, post_op_notes=$3, complications=$4, duration_minutes=$5 WHERE id=$6',
            [status || 'Completed', operative_notes || '', post_op_notes || '', complications || '', duration_minutes || 0, req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
// Consent Forms
app.get('/api/cosmetic/consents', requireAuth, async (req, res) => {
    try {
        const { case_id } = req.query;
        if (case_id) res.json((await pool.query('SELECT * FROM cosmetic_consents WHERE case_id=$1 ORDER BY created_at DESC', [case_id])).rows);
        else res.json((await pool.query('SELECT * FROM cosmetic_consents ORDER BY created_at DESC')).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/cosmetic/consents', requireAuth, async (req, res) => {
    try {
        const { case_id, patient_id, patient_name, procedure_name, consent_type, risks_explained, alternatives_explained, expected_results, limitations, patient_questions, is_photography_consent, is_anesthesia_consent, is_blood_transfusion_consent, witness_name } = req.body;
        const now = new Date();
        const result = await pool.query('INSERT INTO cosmetic_consents (case_id, patient_id, patient_name, procedure_name, consent_type, surgeon, risks_explained, alternatives_explained, expected_results, limitations, patient_questions, is_photography_consent, is_anesthesia_consent, is_blood_transfusion_consent, witness_name, consent_date, consent_time, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *',
            [case_id || 0, patient_id, patient_name || '', procedure_name || '', consent_type || 'Surgery', req.session.user.name, risks_explained || '', alternatives_explained || '', expected_results || '', limitations || '', patient_questions || '', is_photography_consent ? 1 : 0, is_anesthesia_consent ? 1 : 0, is_blood_transfusion_consent ? 1 : 0, witness_name || '', now.toISOString().split('T')[0], now.toTimeString().substring(0, 5), 'Signed']);
        logAudit(req.session.user.id, req.session.user.name, 'CONSENT_SIGNED', 'Cosmetic Surgery', `Consent for ${procedure_name} - patient ${patient_name}`, req.ip);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
// Follow-ups
app.get('/api/cosmetic/followups', requireAuth, async (req, res) => {
    try {
        const { case_id } = req.query;
        if (case_id) res.json((await pool.query('SELECT * FROM cosmetic_followups WHERE case_id=$1 ORDER BY followup_date DESC', [case_id])).rows);
        else res.json((await pool.query('SELECT * FROM cosmetic_followups ORDER BY followup_date DESC')).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/cosmetic/followups', requireAuth, async (req, res) => {
    try {
        const { case_id, patient_id, patient_name, followup_date, days_post_op, healing_status, pain_level, swelling, complications, patient_satisfaction, surgeon_notes, next_followup } = req.body;
        const result = await pool.query('INSERT INTO cosmetic_followups (case_id, patient_id, patient_name, followup_date, days_post_op, healing_status, pain_level, swelling, complications, patient_satisfaction, surgeon_notes, next_followup, surgeon) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',
            [case_id || 0, patient_id, patient_name || '', followup_date || new Date().toISOString().split('T')[0], days_post_op || 0, healing_status || 'Good', pain_level || 0, swelling || 'Mild', complications || '', patient_satisfaction || 0, surgeon_notes || '', next_followup || '', req.session.user.name]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== PATIENT PORTAL =====
app.get('/api/portal/users', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT pu.*, p.name_ar, p.name_en, p.file_number FROM portal_users pu LEFT JOIN patients p ON pu.patient_id=p.id ORDER BY pu.id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/portal/users', requireAuth, async (req, res) => {
    try {
        const { patient_id, username, password, email, phone } = req.body;
        const bcrypt = require('bcryptjs');
        const hash = await bcrypt.hash(password || '123456', 10);
        const result = await pool.query('INSERT INTO portal_users (patient_id, username, password_hash, email, phone) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [patient_id, username || '', hash, email || '', phone || '']);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/portal/appointments', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM portal_appointments ORDER BY created_at DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/portal/appointments/:id', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query('UPDATE portal_appointments SET status=$1 WHERE id=$2', [status, req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== ZATCA E-INVOICING =====
app.get('/api/zatca/invoices', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM zatca_invoices ORDER BY created_at DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/zatca/generate', requireAuth, async (req, res) => {
    try {
        const { invoice_id } = req.body;
        const inv = (await pool.query('SELECT i.*, p.name_ar, p.name_en, p.national_id FROM invoices i LEFT JOIN patients p ON i.patient_id=p.id WHERE i.id=$1', [invoice_id])).rows[0];
        if (!inv) return res.status(404).json({ error: 'Invoice not found' });
        const company = (await pool.query("SELECT setting_value FROM company_settings WHERE setting_key='company_name'")).rows[0];
        const vat = (await pool.query("SELECT setting_value FROM company_settings WHERE setting_key='vat_number'")).rows[0];
        const totalBeforeVat = Number(inv.total) / 1.15;
        const vatAmount = Number(inv.total) - totalBeforeVat;
        const qrData = Buffer.from(JSON.stringify({ seller: company?.setting_value || 'Nama Medical', vat: vat?.setting_value || '', date: new Date().toISOString(), total: inv.total, vatAmount: vatAmount.toFixed(2) })).toString('base64');
        const result = await pool.query('INSERT INTO zatca_invoices (invoice_id, invoice_number, seller_name, seller_vat, buyer_name, total_before_vat, vat_amount, total_with_vat, qr_code, submission_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
            [invoice_id, 'INV-' + String(invoice_id).padStart(8, '0'), company?.setting_value || '', vat?.setting_value || '', inv.name_ar || inv.name_en || '', totalBeforeVat.toFixed(2), vatAmount.toFixed(2), inv.total, qrData, 'Generated']);
        logAudit(req.session.user.id, req.session.user.name, 'ZATCA_GENERATE', 'ZATCA', `E-invoice for INV-${invoice_id}`, req.ip);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== TELEMEDICINE =====
app.get('/api/telemedicine/sessions', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM telemedicine_sessions ORDER BY scheduled_date DESC, scheduled_time DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/telemedicine/sessions', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, speciality, session_type, scheduled_date, scheduled_time, duration_minutes, notes } = req.body;
        const link = 'https://meet.nama.sa/' + Math.random().toString(36).substring(7);
        const result = await pool.query('INSERT INTO telemedicine_sessions (patient_id, patient_name, doctor, speciality, session_type, scheduled_date, scheduled_time, duration_minutes, meeting_link, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
            [patient_id, patient_name || '', req.session.user.name, speciality || '', session_type || 'Video', scheduled_date || '', scheduled_time || '', duration_minutes || 15, link, notes || '']);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/telemedicine/sessions/:id', requireAuth, async (req, res) => {
    try {
        const { status, diagnosis, prescription } = req.body;
        await pool.query('UPDATE telemedicine_sessions SET status=$1, diagnosis=$2, prescription=$3 WHERE id=$4', [status || 'Completed', diagnosis || '', prescription || '', req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== PATHOLOGY =====
app.get('/api/pathology/cases', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM pathology_cases ORDER BY created_at DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/pathology/cases', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, specimen_type, collection_date, gross_description, notes } = req.body;
        const result = await pool.query('INSERT INTO pathology_cases (patient_id, patient_name, specimen_type, collection_date, received_date, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            [patient_id, patient_name || '', specimen_type || '', collection_date || new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0], 'Received']);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/pathology/cases/:id', requireAuth, async (req, res) => {
    try {
        const { gross_description, microscopic_findings, diagnosis, icd_code, stage, grade, status } = req.body;
        await pool.query('UPDATE pathology_cases SET gross_description=$1, microscopic_findings=$2, diagnosis=$3, icd_code=$4, stage=$5, grade=$6, status=$7, pathologist=$8, report_date=$9 WHERE id=$10',
            [gross_description || '', microscopic_findings || '', diagnosis || '', icd_code || '', stage || '', grade || '', status || 'Reported', req.session.user.name, new Date().toISOString().split('T')[0], req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== SOCIAL WORK =====
app.get('/api/social-work/cases', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM social_work_cases ORDER BY created_at DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/social-work/cases', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, case_type, assessment, plan, priority } = req.body;
        const result = await pool.query('INSERT INTO social_work_cases (patient_id, patient_name, case_type, social_worker, assessment, plan, priority) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [patient_id, patient_name || '', case_type || 'General', req.session.user.name, assessment || '', plan || '', priority || 'Medium']);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/social-work/cases/:id', requireAuth, async (req, res) => {
    try {
        const { status, interventions, referrals, follow_up_date } = req.body;
        await pool.query('UPDATE social_work_cases SET status=$1, interventions=$2, referrals=$3, follow_up_date=$4 WHERE id=$5',
            [status || 'Open', interventions || '', referrals || '', follow_up_date || '', req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== MORTUARY =====
app.get('/api/mortuary/cases', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM mortuary_cases ORDER BY created_at DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/mortuary/cases', requireAuth, async (req, res) => {
    try {
        const { patient_id, deceased_name, date_of_death, time_of_death, cause_of_death, attending_physician, next_of_kin, next_of_kin_phone, notes } = req.body;
        const result = await pool.query('INSERT INTO mortuary_cases (patient_id, deceased_name, date_of_death, time_of_death, cause_of_death, attending_physician, next_of_kin, next_of_kin_phone, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
            [patient_id || 0, deceased_name || '', date_of_death || new Date().toISOString().split('T')[0], time_of_death || '', cause_of_death || '', attending_physician || '', next_of_kin || '', next_of_kin_phone || '', notes || '']);
        logAudit(req.session.user.id, req.session.user.name, 'DEATH_RECORD', 'Mortuary', `Death record for ${deceased_name}`, req.ip);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/mortuary/cases/:id', requireAuth, async (req, res) => {
    try {
        const { release_status, released_to, death_certificate_number } = req.body;
        await pool.query('UPDATE mortuary_cases SET release_status=$1, released_to=$2, released_date=$3, death_certificate_number=$4 WHERE id=$5',
            [release_status || 'Released', released_to || '', new Date().toISOString().split('T')[0], death_certificate_number || '', req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== CME =====
app.get('/api/cme/activities', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM cme_activities ORDER BY activity_date DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/cme/activities', requireAuth, async (req, res) => {
    try {
        const { title, category, provider, credit_hours, activity_date, location, max_participants, description } = req.body;
        const result = await pool.query('INSERT INTO cme_activities (title, category, provider, credit_hours, activity_date, location, max_participants, description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
            [title || '', category || 'Conference', provider || '', credit_hours || 0, activity_date || '', location || '', max_participants || 50, description || '']);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/cme/registrations', requireAuth, async (req, res) => {
    try {
        const { activity_id } = req.query;
        if (activity_id) res.json((await pool.query('SELECT * FROM cme_registrations WHERE activity_id=$1', [activity_id])).rows);
        else res.json((await pool.query('SELECT * FROM cme_registrations ORDER BY id DESC')).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/cme/registrations', requireAuth, async (req, res) => {
    try {
        const { activity_id, employee_name } = req.body;
        const result = await pool.query('INSERT INTO cme_registrations (activity_id, employee_name, registration_date) VALUES ($1,$2,$3) RETURNING *',
            [activity_id, employee_name || req.session.user.name, new Date().toISOString().split('T')[0]]);
        await pool.query('UPDATE cme_activities SET registered=registered+1 WHERE id=$1', [activity_id]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== eMAR =====
app.get('/api/emar/orders', requireAuth, async (req, res) => {
    try {
        const { patient_id } = req.query;
        if (patient_id) res.json((await pool.query('SELECT * FROM emar_orders WHERE patient_id=$1 ORDER BY created_at DESC', [patient_id])).rows);
        else res.json((await pool.query('SELECT * FROM emar_orders WHERE status=$1 ORDER BY created_at DESC', ['Active'])).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/emar/orders', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, medication, dose, route, frequency, start_date } = req.body;
        const result = await pool.query('INSERT INTO emar_orders (patient_id, patient_name, medication, dose, route, frequency, start_date, prescriber) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
            [patient_id, patient_name || '', medication || '', dose || '', route || 'Oral', frequency || 'TID', start_date || new Date().toISOString().split('T')[0], req.session.user.name]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/emar/administrations', requireAuth, async (req, res) => {
    try {
        const { order_id } = req.query;
        if (order_id) res.json((await pool.query('SELECT * FROM emar_administrations WHERE emar_order_id=$1 ORDER BY created_at DESC', [order_id])).rows);
        else res.json((await pool.query('SELECT * FROM emar_administrations ORDER BY created_at DESC LIMIT 50')).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/emar/administrations', requireAuth, async (req, res) => {
    try {
        const { emar_order_id, patient_id, medication, dose, scheduled_time, status, reason_not_given, notes } = req.body;
        const result = await pool.query('INSERT INTO emar_administrations (emar_order_id, patient_id, medication, dose, scheduled_time, actual_time, administered_by, status, reason_not_given, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
            [emar_order_id, patient_id || 0, medication || '', dose || '', scheduled_time || '', new Date().toISOString(), req.session.user.name, status || 'Given', reason_not_given || '', notes || '']);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== NURSING CARE PLANS =====
app.get('/api/nursing/care-plans', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM nursing_care_plans ORDER BY created_at DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/nursing/care-plans', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, diagnosis, priority, goals, interventions, expected_outcomes } = req.body;
        const result = await pool.query('INSERT INTO nursing_care_plans (patient_id, patient_name, diagnosis, priority, goals, interventions, expected_outcomes, nurse) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
            [patient_id, patient_name || '', diagnosis || '', priority || 'Medium', goals || '', interventions || '', expected_outcomes || '', req.session.user.name]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/nursing/assessments', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM nursing_assessments ORDER BY created_at DESC LIMIT 50')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/nursing/assessments', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, assessment_type, fall_risk_score, braden_score, pain_score, gcs_score, shift, notes } = req.body;
        const result = await pool.query('INSERT INTO nursing_assessments (patient_id, patient_name, assessment_type, fall_risk_score, braden_score, pain_score, gcs_score, nurse, shift, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
            [patient_id, patient_name || '', assessment_type || 'General', fall_risk_score || 0, braden_score || 23, pain_score || 0, gcs_score || 15, req.session.user.name, shift || 'Morning', notes || '']);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== FINANCIAL DAILY CLOSE =====
app.get('/api/finance/daily-close', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM daily_close ORDER BY created_at DESC LIMIT 30')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/finance/daily-close', requireAuth, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        // Aggregate today's transactions
        const cash = (await pool.query("SELECT COALESCE(SUM(total),0) as t, COUNT(*) as c FROM invoices WHERE created_at::date=CURRENT_DATE AND payment_method='Cash'")).rows[0];
        const card = (await pool.query("SELECT COALESCE(SUM(total),0) as t FROM invoices WHERE created_at::date=CURRENT_DATE AND payment_method='Card'")).rows[0];
        const ins = (await pool.query("SELECT COALESCE(SUM(total),0) as t FROM invoices WHERE created_at::date=CURRENT_DATE AND payment_method='Insurance'")).rows[0];
        const totalTx = (await pool.query("SELECT COUNT(*) as c FROM invoices WHERE created_at::date=CURRENT_DATE")).rows[0];
        const { opening_balance, closing_balance, notes } = req.body;
        const totalCash = Number(cash.t); const totalCard = Number(card.t); const totalIns = Number(ins.t);
        const variance = Number(closing_balance || 0) - (Number(opening_balance || 0) + totalCash);
        const result = await pool.query('INSERT INTO daily_close (close_date, cashier, total_cash, total_card, total_insurance, total_transactions, opening_balance, closing_balance, variance, notes, status, closed_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',
            [today, req.session.user.name, totalCash, totalCard, totalIns, Number(totalTx.c), Number(opening_balance || 0), Number(closing_balance || 0), variance, notes || '', 'Closed', req.session.user.name]);
        logAudit(req.session.user.id, req.session.user.name, 'DAILY_CLOSE', 'Finance', `Daily close for ${today}: Cash=${totalCash}, Card=${totalCard}`, req.ip);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== MEDICAL RECORDS / HIM =====
app.get('/api/medical-records/files', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM medical_records_files ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/medical-records/requests', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM medical_records_requests ORDER BY requested_at DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/medical-records/requests', requireAuth, async (req, res) => {
    try {
        const { patient_id, file_number, department, purpose, notes } = req.body;
        const result = await pool.query('INSERT INTO medical_records_requests (patient_id, file_number, requested_by, department, purpose, notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            [patient_id, file_number, req.session.user.name, department || '', purpose || 'Clinic Visit', notes || '']);
        logAudit(req.session.user.id, req.session.user.name, 'REQUEST_FILE', 'Medical Records', `File ${file_number} requested`, req.ip);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/medical-records/requests/:id', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const now = new Date().toISOString();
        if (status === 'Delivered') await pool.query('UPDATE medical_records_requests SET status=$1, delivered_at=$2 WHERE id=$3', [status, now, req.params.id]);
        else if (status === 'Returned') await pool.query('UPDATE medical_records_requests SET status=$1, returned_at=$2 WHERE id=$3', [status, now, req.params.id]);
        else await pool.query('UPDATE medical_records_requests SET status=$1 WHERE id=$2', [status, req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/medical-records/coding', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM medical_records_coding ORDER BY id DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/medical-records/coding', requireAuth, async (req, res) => {
    try {
        const { patient_id, visit_id, primary_diagnosis, primary_icd10, secondary_diagnoses, drg_code, notes } = req.body;
        const result = await pool.query('INSERT INTO medical_records_coding (patient_id, visit_id, primary_diagnosis, primary_icd10, secondary_diagnoses, drg_code, coder, coding_date, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
            [patient_id, visit_id || 0, primary_diagnosis || '', primary_icd10 || '', secondary_diagnoses || '', drg_code || '', req.session.user.name, new Date().toISOString().split('T')[0], 'Coded']);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== CLINICAL PHARMACY =====
app.get('/api/clinical-pharmacy/reviews', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM clinical_pharmacy_reviews ORDER BY created_at DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/clinical-pharmacy/reviews', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, prescription_id, review_type, findings, recommendations, interventions, severity } = req.body;
        const result = await pool.query('INSERT INTO clinical_pharmacy_reviews (patient_id, patient_name, prescription_id, review_type, pharmacist, findings, recommendations, interventions, severity) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
            [patient_id, patient_name || '', prescription_id || 0, review_type || 'Medication Review', req.session.user.name, findings || '', recommendations || '', interventions || '', severity || 'Low']);
        logAudit(req.session.user.id, req.session.user.name, 'CLINICAL_REVIEW', 'Clinical Pharmacy', `Review for patient ${patient_name}`, req.ip);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/clinical-pharmacy/reviews/:id', requireAuth, async (req, res) => {
    try {
        const { outcome, status } = req.body;
        await pool.query('UPDATE clinical_pharmacy_reviews SET outcome=$1, status=$2 WHERE id=$3', [outcome || 'Resolved', status || 'Closed', req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/clinical-pharmacy/interactions', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM drug_interactions ORDER BY severity DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/clinical-pharmacy/education', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM patient_drug_education ORDER BY created_at DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/clinical-pharmacy/education', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, medication, instructions, side_effects, precautions } = req.body;
        const result = await pool.query('INSERT INTO patient_drug_education (patient_id, patient_name, medication, instructions, side_effects, precautions, educated_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [patient_id, patient_name || '', medication || '', instructions || '', side_effects || '', precautions || '', req.session.user.name]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== REHABILITATION / PT =====
app.get('/api/rehab/patients', requireAuth, async (req, res) => {
    try { res.json((await pool.query('SELECT * FROM rehab_patients ORDER BY created_at DESC')).rows); }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/rehab/patients', requireAuth, async (req, res) => {
    try {
        const { patient_id, patient_name, diagnosis, referral_source, therapist, therapy_type, start_date, target_end_date, notes } = req.body;
        const result = await pool.query('INSERT INTO rehab_patients (patient_id, patient_name, diagnosis, referral_source, therapist, therapy_type, start_date, target_end_date, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
            [patient_id, patient_name || '', diagnosis || '', referral_source || '', therapist || '', therapy_type || 'Physical Therapy', start_date || new Date().toISOString().split('T')[0], target_end_date || '', notes || '']);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/rehab/sessions', requireAuth, async (req, res) => {
    try {
        const { patient_id } = req.query;
        if (patient_id) res.json((await pool.query('SELECT * FROM rehab_sessions WHERE rehab_patient_id=$1 ORDER BY session_number DESC', [patient_id])).rows);
        else res.json((await pool.query('SELECT * FROM rehab_sessions ORDER BY created_at DESC LIMIT 100')).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/rehab/sessions', requireAuth, async (req, res) => {
    try {
        const { rehab_patient_id, patient_id, session_number, therapist, session_type, exercises, duration_minutes, pain_before, pain_after, progress_notes } = req.body;
        const result = await pool.query('INSERT INTO rehab_sessions (rehab_patient_id, patient_id, session_date, session_number, therapist, session_type, exercises, duration_minutes, pain_before, pain_after, progress_notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
            [rehab_patient_id, patient_id || 0, new Date().toISOString().split('T')[0], session_number || 1, therapist || req.session.user.name, session_type || 'Individual', exercises || '', duration_minutes || 30, pain_before || 0, pain_after || 0, progress_notes || '']);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/rehab/goals', requireAuth, async (req, res) => {
    try {
        const { patient_id } = req.query;
        if (patient_id) res.json((await pool.query('SELECT * FROM rehab_goals WHERE rehab_patient_id=$1 ORDER BY id', [patient_id])).rows);
        else res.json((await pool.query('SELECT * FROM rehab_goals ORDER BY id DESC')).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/rehab/goals', requireAuth, async (req, res) => {
    try {
        const { rehab_patient_id, goal_description, target_date } = req.body;
        const result = await pool.query('INSERT INTO rehab_goals (rehab_patient_id, goal_description, target_date) VALUES ($1,$2,$3) RETURNING *',
            [rehab_patient_id, goal_description || '', target_date || '']);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/rehab/goals/:id', requireAuth, async (req, res) => {
    try {
        const { progress, status } = req.body;
        await pool.query('UPDATE rehab_goals SET progress=$1, status=$2 WHERE id=$3', [progress || 0, status || 'In Progress', req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== MESSAGING =====
app.get('/api/messages', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;
        res.json((await pool.query(`SELECT m.*, su.display_name as sender_name FROM internal_messages m LEFT JOIN system_users su ON m.sender_id=su.id WHERE m.receiver_id=$1 ORDER BY m.created_at DESC`, [userId])).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.get('/api/messages/sent', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;
        res.json((await pool.query(`SELECT m.*, su.display_name as receiver_name FROM internal_messages m LEFT JOIN system_users su ON m.receiver_id=su.id WHERE m.sender_id=$1 ORDER BY m.created_at DESC`, [userId])).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.post('/api/messages', requireAuth, async (req, res) => {
    try {
        const { receiver_id, subject, body, priority } = req.body;
        const senderId = req.session.user.id;
        const result = await pool.query('INSERT INTO internal_messages (sender_id, receiver_id, subject, body, priority) VALUES ($1,$2,$3,$4,$5) RETURNING id',
            [senderId, receiver_id, subject || '', body || '', priority || 'Normal']);
        logAudit(senderId, req.session.user.name, 'SEND_MESSAGE', 'Messaging', `Message to user ${receiver_id}: ${subject}`, req.ip);
        res.json({ success: true, id: result.rows[0].id });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.put('/api/messages/:id/read', requireAuth, async (req, res) => {
    try {
        await pool.query('UPDATE internal_messages SET is_read=1 WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
app.delete('/api/messages/:id', requireAuth, async (req, res) => {
    try {
        await pool.query('DELETE FROM internal_messages WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== AUDIT TRAIL =====
app.get('/api/audit-trail', requireAuth, async (req, res) => {
    try {
        const { limit = 100 } = req.query;
        res.json((await pool.query('SELECT * FROM audit_trail ORDER BY created_at DESC LIMIT $1', [parseInt(limit)])).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== PRINT API =====
app.get('/api/print/invoice/:id', requireAuth, async (req, res) => {
    try {
        const inv = (await pool.query('SELECT * FROM invoices WHERE id=$1', [req.params.id])).rows[0];
        if (!inv) return res.status(404).json({ error: 'Not found' });
        const settings = {};
        const settingsRows = (await pool.query('SELECT * FROM company_settings')).rows;
        settingsRows.forEach(s => settings[s.setting_key] = s.setting_value);
        res.json({ invoice: inv, company: settings });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/print/prescription/:id', requireAuth, async (req, res) => {
    try {
        const rx = (await pool.query('SELECT p.*, m.name as med_name FROM prescriptions p LEFT JOIN medications m ON p.medication_id=m.id WHERE p.id=$1', [req.params.id])).rows[0];
        if (!rx) return res.status(404).json({ error: 'Not found' });
        const patient = (await pool.query('SELECT * FROM patients WHERE id=$1', [rx.patient_id])).rows[0];
        res.json({ prescription: rx, patient });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/print/lab-report/:id', requireAuth, async (req, res) => {
    try {
        const order = (await pool.query('SELECT * FROM lab_radiology_orders WHERE id=$1', [req.params.id])).rows[0];
        if (!order) return res.status(404).json({ error: 'Not found' });
        const results = (await pool.query('SELECT lr.*, lt.test_name, lt.normal_range FROM lab_results lr LEFT JOIN lab_tests_catalog lt ON lr.test_id=lt.id WHERE lr.order_id=$1', [req.params.id])).rows;
        const patient = (await pool.query('SELECT * FROM patients WHERE id=$1', [order.patient_id])).rows[0];
        res.json({ order, results, patient });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
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

// ===== PHARMACY & PRESCRIPTIONS =====
// Doctor sends prescription → Pharmacy queue
app.post('/api/prescriptions', requireAuth, async (req, res) => {
    try {
        const { patient_id, medication_name, dosage, quantity_per_day, frequency, duration } = req.body;
        const rxText = `${medication_name || ''} | ${dosage || ''}${quantity_per_day && quantity_per_day !== '1' ? ' (×' + quantity_per_day + ')' : ''} | ${frequency || ''} | ${duration || ''}`;
        // Ensure individual columns exist
        await pool.query(`ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS medication_name TEXT DEFAULT ''`).catch(() => { });
        await pool.query(`ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS dosage TEXT DEFAULT ''`).catch(() => { });
        await pool.query(`ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS quantity_per_day TEXT DEFAULT '1'`).catch(() => { });
        await pool.query(`ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS frequency TEXT DEFAULT ''`).catch(() => { });
        await pool.query(`ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT ''`).catch(() => { });
        const r = await pool.query(
            `INSERT INTO pharmacy_prescriptions_queue (patient_id, doctor_id, prescription_text, medication_name, dosage, quantity_per_day, frequency, duration, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending') RETURNING *`,
            [patient_id, req.session.user?.id || 0, rxText, medication_name || '', dosage || '', quantity_per_day || '1', frequency || '', duration || '']
        );
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Get pharmacy prescriptions queue
app.get('/api/pharmacy/queue', requireAuth, async (req, res) => {
    try {
        const rows = (await pool.query(`SELECT q.*, p.name_ar as patient_name, p.file_number, p.phone, p.age, p.department
            FROM pharmacy_prescriptions_queue q 
            LEFT JOIN patients p ON q.patient_id = p.id 
            ORDER BY q.id DESC`)).rows;
        res.json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Update prescription status (Dispense with sale)
app.put('/api/pharmacy/queue/:id', requireAuth, async (req, res) => {
    try {
        const { status, price, payment_method, patient_id } = req.body;
        // Ensure columns exist
        await pool.query(`ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS price REAL DEFAULT 0`).catch(() => { });
        await pool.query(`ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT ''`).catch(() => { });
        await pool.query(
            `UPDATE pharmacy_prescriptions_queue SET status=$1, dispensed_by=$2, dispensed_at=CURRENT_TIMESTAMP, price=$3, payment_method=$4 WHERE id=$5`,
            [status || 'Dispensed', req.session.user?.display_name || '', price || 0, payment_method || 'Cash', req.params.id]
        );
        // Create invoice if price > 0
        if (price && price > 0 && patient_id) {
            const rx = (await pool.query('SELECT * FROM pharmacy_prescriptions_queue WHERE id=$1', [req.params.id])).rows[0];
            const patient = patient_id ? (await pool.query('SELECT name_ar, name_en, nationality FROM patients WHERE id=$1', [patient_id])).rows[0] : null;
            const vat = await calcVAT(patient_id);
            const { total: finalTotal, vatAmount } = addVAT(price, vat.rate);
            await pool.query(
                `INSERT INTO invoices (patient_id, patient_name, total, amount, vat_amount, description, service_type, paid, payment_method) 
                 VALUES ($1, $2, $3, $4, $5, $6, 'Pharmacy', 1, $7)`,
                [patient_id, patient?.name_ar || patient?.name_en || '', finalTotal, price, vatAmount,
                    `Pharmacy: ${rx?.prescription_text || ''}`, payment_method || 'Cash']
            );
        }
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Get drug catalog
app.get('/api/pharmacy/drugs', requireAuth, async (req, res) => {
    try {
        const rows = (await pool.query('SELECT * FROM pharmacy_drug_catalog ORDER BY drug_name')).rows;
        res.json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// Add drug to catalog
app.post('/api/pharmacy/drugs', requireAuth, async (req, res) => {
    try {
        const { drug_name, selling_price, stock_qty, category, active_ingredient } = req.body;
        const r = await pool.query(
            `INSERT INTO pharmacy_drug_catalog (drug_name, selling_price, stock_qty, category, active_ingredient) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [drug_name || '', selling_price || 0, stock_qty || 0, category || '', active_ingredient || '']
        );
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== P&L REPORT =====
app.get('/api/reports/pnl', requireAuth, async (req, res) => {
    try {
        const { from, to } = req.query;
        let dateFilter = '';
        let params = [];
        if (from && to && /^\d{4}-\d{2}-\d{2}$/.test(from) && /^\d{4}-\d{2}-\d{2}$/.test(to)) {
            dateFilter = 'WHERE created_at BETWEEN $1 AND $2';
            params = [from, to + ' 23:59:59'];
        }
        const revenue = (await pool.query(`SELECT COALESCE(SUM(total),0) as total, COALESCE(SUM(CASE WHEN paid=1 THEN total ELSE 0 END),0) as collected, COALESCE(SUM(discount),0) as discounts FROM invoices ${dateFilter}`, params)).rows[0];
        const byType = (await pool.query(`SELECT service_type, COUNT(*) as cnt, COALESCE(SUM(total),0) as total FROM invoices ${dateFilter} GROUP BY service_type ORDER BY total DESC`, params)).rows;
        const expenses = (await pool.query('SELECT COALESCE(SUM(cost_price * stock_qty),0) as drug_cost FROM pharmacy_drug_catalog WHERE is_active=1')).rows[0];
        res.json({
            totalRevenue: parseFloat(revenue.total),
            totalCollected: parseFloat(revenue.collected),
            totalDiscounts: parseFloat(revenue.discounts),
            totalUncollected: parseFloat(revenue.total) - parseFloat(revenue.collected),
            estimatedCosts: parseFloat(expenses.drug_cost),
            netProfit: parseFloat(revenue.collected) - parseFloat(expenses.drug_cost),
            byType
        });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== COMPREHENSIVE DIAGNOSIS TEMPLATES (80+ diagnoses, 12 specialties) =====
app.get('/api/diagnosis-templates', requireAuth, async (req, res) => {
    try {
        const templates = {
            'General / عام': [
                { name: 'Upper Respiratory Tract Infection', name_ar: 'التهاب الجهاز التنفسي العلوي', icd: 'J06.9', symptoms: 'Cough, runny nose, sore throat, fever', treatment: 'Paracetamol 500mg QID, rest, fluids, saline nasal spray' },
                { name: 'Acute Gastroenteritis', name_ar: 'التهاب المعدة والأمعاء الحاد', icd: 'K52.9', symptoms: 'Nausea, vomiting, diarrhea, abdominal cramps', treatment: 'ORS, Ondansetron 4mg, Loperamide if needed, probiotics' },
                { name: 'Urinary Tract Infection', name_ar: 'التهاب المسالك البولية', icd: 'N39.0', symptoms: 'Dysuria, frequency, urgency, suprapubic pain, cloudy urine', treatment: 'Ciprofloxacin 500mg BID x7d or Nitrofurantoin 100mg BID x5d' },
                { name: 'Tension Headache', name_ar: 'صداع توتري', icd: 'G44.2', symptoms: 'Bilateral pressure-like headache, no nausea, no photophobia', treatment: 'Paracetamol 1g, Ibuprofen 400mg, stress management, adequate sleep' },
                { name: 'Essential Hypertension', name_ar: 'ارتفاع ضغط الدم الأساسي', icd: 'I10', symptoms: 'Usually asymptomatic, headache, dizziness if severe', treatment: 'Amlodipine 5mg daily, lifestyle modification, low salt diet, follow-up 2 weeks' },
                { name: 'Type 2 Diabetes Mellitus', name_ar: 'السكري النوع الثاني', icd: 'E11.9', symptoms: 'Polyuria, polydipsia, fatigue, blurred vision, weight loss', treatment: 'Metformin 500mg BID, diet control, exercise 30min/day, HbA1c in 3 months' },
                { name: 'Acute Bronchitis', name_ar: 'التهاب الشعب الهوائية الحاد', icd: 'J20.9', symptoms: 'Productive cough, chest discomfort, wheezing, low-grade fever', treatment: 'Ambroxol 30mg TID, Salbutamol inhaler PRN, fluids, no antibiotics if viral' },
                { name: 'Allergic Rhinitis', name_ar: 'التهاب الأنف التحسسي', icd: 'J30.4', symptoms: 'Sneezing, nasal congestion, watery rhinorrhea, itchy eyes', treatment: 'Cetirizine 10mg daily, Fluticasone nasal spray BID, avoid allergens' },
                { name: 'Iron Deficiency Anemia', name_ar: 'فقر الدم بنقص الحديد', icd: 'D50.9', symptoms: 'Fatigue, pallor, dyspnea on exertion, brittle nails, pica', treatment: 'Ferrous sulfate 325mg BID on empty stomach with vitamin C, CBC in 4 weeks' },
                { name: 'Low Back Pain (Mechanical)', name_ar: 'ألم أسفل الظهر الميكانيكي', icd: 'M54.5', symptoms: 'Lower back pain, muscle spasm, limited range of motion, no radiation', treatment: 'Diclofenac 75mg BID, Cyclobenzaprine 10mg HS, hot packs, physiotherapy referral' },
                { name: 'Vitamin D Deficiency', name_ar: 'نقص فيتامين د', icd: 'E55.9', symptoms: 'Bone pain, muscle weakness, fatigue, depression, frequent infections', treatment: 'Cholecalciferol 50,000IU weekly x8 weeks then 2,000IU daily maintenance' },
                { name: 'Dyslipidemia', name_ar: 'اضطراب الدهون', icd: 'E78.5', symptoms: 'Usually asymptomatic, discovered on routine labs', treatment: 'Atorvastatin 20mg HS, low-fat diet, exercise, lipid panel in 6 weeks' },
                { name: 'Hypothyroidism', name_ar: 'قصور الغدة الدرقية', icd: 'E03.9', symptoms: 'Fatigue, weight gain, cold intolerance, constipation, dry skin, hair loss', treatment: 'Levothyroxine 50mcg daily on empty stomach, TSH in 6 weeks' },
                { name: 'Gastroesophageal Reflux Disease', name_ar: 'ارتجاع المريء', icd: 'K21.0', symptoms: 'Heartburn, regurgitation, chest pain after eating, sour taste', treatment: 'Omeprazole 20mg daily before breakfast, avoid spicy food, elevate head of bed' },
                { name: 'Acute Sinusitis', name_ar: 'التهاب الجيوب الأنفية الحاد', icd: 'J01.9', symptoms: 'Facial pain/pressure, nasal congestion, purulent discharge, headache', treatment: 'Amoxicillin 500mg TID x10d, decongestant spray x3d max, saline irrigation' }
            ],
            'Internal Medicine / الباطنية': [
                { name: 'Community Acquired Pneumonia', name_ar: 'التهاب رئوي مكتسب من المجتمع', icd: 'J18.9', symptoms: 'Fever, productive cough, dyspnea, pleuritic chest pain, crackles', treatment: 'Azithromycin 500mg D1 then 250mg D2-5 + Amoxicillin-Clav 625mg TID, CXR follow-up' },
                { name: 'Acute Kidney Injury', name_ar: 'إصابة كلوية حادة', icd: 'N17.9', symptoms: 'Decreased urine output, edema, fatigue, nausea, confusion', treatment: 'IV fluids, stop nephrotoxic drugs, monitor I/O, BMP Q12h, nephrology consult' },
                { name: 'Congestive Heart Failure', name_ar: 'فشل القلب الاحتقاني', icd: 'I50.9', symptoms: 'Dyspnea, orthopnea, PND, leg edema, weight gain, crackles', treatment: 'Furosemide 40mg IV, fluid restriction <1.5L, daily weights, O2 PRN, cardiology consult' },
                { name: 'Diabetic Ketoacidosis', name_ar: 'حماض كيتوني سكري', icd: 'E10.1', symptoms: 'Polyuria, nausea/vomiting, abdominal pain, Kussmaul breathing, fruity breath', treatment: 'NS bolus, insulin drip 0.1U/kg/hr, K+ replacement, BMP Q2h, ICU admission' },
                { name: 'Deep Vein Thrombosis', name_ar: 'جلطة الأوردة العميقة', icd: 'I82.9', symptoms: 'Unilateral leg swelling, pain, warmth, redness, pitting edema', treatment: 'Enoxaparin 1mg/kg BID, Warfarin bridge, compression stockings, Doppler US' },
                { name: 'Chronic Kidney Disease', name_ar: 'مرض كلوي مزمن', icd: 'N18.9', symptoms: 'Fatigue, edema, decreased appetite, nocturia, pruritus', treatment: 'ACE inhibitor, low protein diet, phosphate binders, EPO if anemia, nephrology F/U' },
                { name: 'Peptic Ulcer Disease', name_ar: 'قرحة المعدة', icd: 'K27.9', symptoms: 'Epigastric pain, relation to meals, nausea, melena if bleeding', treatment: 'PPI high dose, H.pylori triple therapy if positive, avoid NSAIDs, EGD if alarm symptoms' },
                { name: 'Acute Pancreatitis', name_ar: 'التهاب البنكرياس الحاد', icd: 'K85.9', symptoms: 'Severe epigastric pain radiating to back, nausea/vomiting, elevated lipase', treatment: 'NPO, aggressive IV hydration, pain management (Morphine), monitor in hospital' }
            ],
            'Pediatrics / الأطفال': [
                { name: 'Acute Otitis Media', name_ar: 'التهاب الأذن الوسطى الحاد', icd: 'H66.9', symptoms: 'Ear pain, fever, irritability, pulling ear, decreased hearing', treatment: 'Amoxicillin 80-90mg/kg/day BID x10d, Paracetamol for pain, F/U 48h' },
                { name: 'Viral Pharyngitis', name_ar: 'التهاب البلعوم الفيروسي', icd: 'J02.9', symptoms: 'Sore throat, fever, redness, no exudate, rhinorrhea, cough', treatment: 'Supportive care, Paracetamol 15mg/kg Q6h, warm fluids, rest' },
                { name: 'Acute Gastroenteritis (Pediatric)', name_ar: 'نزلة معوية حادة للأطفال', icd: 'A09', symptoms: 'Vomiting, watery diarrhea, dehydration signs, irritability', treatment: 'ORS small frequent sips, Zinc 20mg daily x10-14d, Ondansetron if severe vomiting' },
                { name: 'Asthma Exacerbation', name_ar: 'نوبة ربو حادة', icd: 'J45.9', symptoms: 'Wheezing, dyspnea, cough worse at night, chest tightness, retractions', treatment: 'Salbutamol neb Q20min x3, Ipratropium neb, Prednisolone 1mg/kg x3-5d' },
                { name: 'Hand Foot and Mouth Disease', name_ar: 'مرض اليد والقدم والفم', icd: 'B08.4', symptoms: 'Fever, oral ulcers, vesicular rash on palms/soles/buttocks', treatment: 'Supportive care, Paracetamol, cold fluids, oral gel for ulcers' },
                { name: 'Febrile Seizure (Simple)', name_ar: 'نوبة حمية بسيطة', icd: 'R56.0', symptoms: 'Generalized seizure <15min with fever, age 6m-5y, no focal features', treatment: 'Reassure parents, antipyretics, identify fever source, no AEDs needed' },
                { name: 'Iron Deficiency Anemia (Pediatric)', name_ar: 'فقر الدم بنقص الحديد للأطفال', icd: 'D50.9', symptoms: 'Pallor, irritability, poor appetite, pica, fatigue', treatment: 'Ferrous sulfate 3-6mg/kg/day elemental iron, vitamin C, dietary counseling' },
                { name: 'Bronchiolitis', name_ar: 'التهاب القصيبات', icd: 'J21.9', symptoms: 'Rhinorrhea, cough, wheezing, tachypnea, retractions, poor feeding, age <2y', treatment: 'O2 if SpO2<92%, nasal suctioning, careful hydration, admit if respiratory distress' }
            ],
            'Dermatology / الجلدية': [
                { name: 'Eczema / Atopic Dermatitis', name_ar: 'الإكزيما', icd: 'L30.9', symptoms: 'Itchy dry red patches on flexures, lichenification in chronic', treatment: 'Moisturizers BID, Betamethasone 0.05% cream BID x2w, avoid triggers' },
                { name: 'Acne Vulgaris (Mild)', name_ar: 'حب الشباب الخفيف', icd: 'L70.0', symptoms: 'Comedones, few papules on face, no scarring', treatment: 'Benzoyl peroxide 5% gel HS, Adapalene 0.1% gel HS, gentle cleanser' },
                { name: 'Acne Vulgaris (Moderate-Severe)', name_ar: 'حب الشباب المتوسط-الشديد', icd: 'L70.0', symptoms: 'Papules, pustules, nodules on face/back, possible scarring', treatment: 'Doxycycline 100mg BID x3m, Adapalene-BPO gel, consider Isotretinoin' },
                { name: 'Tinea (Ringworm)', name_ar: 'فطريات جلدية (السعفة)', icd: 'B35.4', symptoms: 'Ring-shaped red patch, raised scaly border, central clearing', treatment: 'Clotrimazole 1% cream BID x2-4w, keep dry, avoid sharing towels' },
                { name: 'Psoriasis (Plaque)', name_ar: 'الصدفية', icd: 'L40.0', symptoms: 'Erythematous plaques with silvery scales, elbows/knees/scalp', treatment: 'Betamethasone cream BID, Calcipotriol ointment, coal tar shampoo' },
                { name: 'Urticaria', name_ar: 'الشرى (الأرتيكاريا)', icd: 'L50.9', symptoms: 'Itchy wheals, migratory, angioedema possible', treatment: 'Cetirizine 10mg BID, avoid triggers, Epinephrine IM if anaphylaxis' },
                { name: 'Contact Dermatitis', name_ar: 'التهاب الجلد التماسي', icd: 'L25.9', symptoms: 'Erythema, vesicles, pruritus at contact site', treatment: 'Remove causative agent, Hydrocortisone 1% cream BID, antihistamine' },
                { name: 'Vitiligo', name_ar: 'البهاق', icd: 'L80', symptoms: 'Depigmented macules/patches, symmetrical, no itching', treatment: 'Tacrolimus 0.1% ointment BID, phototherapy referral, sunscreen' },
                { name: 'Melasma', name_ar: 'الكلف', icd: 'L81.1', symptoms: 'Brown-gray patches on face, bilateral, worse with sun', treatment: 'Hydroquinone 4% cream HS, SPF 50+, Vitamin C serum' }
            ],
            'Orthopedics / العظام': [
                { name: 'Knee Osteoarthritis', name_ar: 'خشونة الركبة', icd: 'M17.9', symptoms: 'Knee pain worse with activity, stiffness <30min, crepitus', treatment: 'Paracetamol 1g TID, Glucosamine 1500mg, physiotherapy, weight loss' },
                { name: 'Lumbar Disc Herniation', name_ar: 'انزلاق غضروفي قطني', icd: 'M51.1', symptoms: 'Low back pain radiating to leg, numbness, positive SLR', treatment: 'NSAIDs, Gabapentin 300mg TID, physiotherapy, epidural if severe, MRI' },
                { name: 'Rotator Cuff Tendinitis', name_ar: 'التهاب وتر الكتف', icd: 'M75.1', symptoms: 'Shoulder pain with overhead activities, night pain, painful arc', treatment: 'NSAIDs, ice, physiotherapy, subacromial injection if persistent' },
                { name: 'Plantar Fasciitis', name_ar: 'التهاب اللفافة الأخمصية', icd: 'M72.2', symptoms: 'Heel pain worst with first steps in morning, point tenderness', treatment: 'Stretching, heel cups, NSAIDs, night splint, steroid injection if chronic' },
                { name: 'Carpal Tunnel Syndrome', name_ar: 'متلازمة النفق الرسغي', icd: 'G56.0', symptoms: 'Numbness in thumb-middle fingers, worse at night, weak grip', treatment: 'Wrist splint at night, NSAIDs, steroid injection, NCS/EMG, surgery if severe' },
                { name: 'Ankle Sprain', name_ar: 'التواء الكاحل', icd: 'S93.4', symptoms: 'Pain/swelling after inversion injury, ecchymosis', treatment: 'RICE protocol, ankle brace, Ibuprofen, gradual rehab, X-ray to rule out fracture' },
                { name: 'Cervical Spondylosis', name_ar: 'خشونة الرقبة', icd: 'M47.8', symptoms: 'Neck pain/stiffness, reduced ROM, referred pain to shoulders', treatment: 'NSAIDs, muscle relaxant, cervical collar short-term, physiotherapy' }
            ],
            'ENT / الأنف والأذن والحنجرة': [
                { name: 'Acute Tonsillitis', name_ar: 'التهاب اللوزتين الحاد', icd: 'J03.9', symptoms: 'Severe sore throat, odynophagia, fever, tonsillar exudate', treatment: 'Penicillin V 500mg QID x10d, Paracetamol, warm salt water gargle' },
                { name: 'Chronic Sinusitis', name_ar: 'التهاب الجيوب المزمن', icd: 'J32.9', symptoms: 'Nasal congestion >12w, facial pressure, post-nasal drip', treatment: 'Fluticasone nasal BID, saline irrigation, Augmentin 625mg TID x14d' },
                { name: 'Allergic Rhinitis', name_ar: 'حساسية الأنف', icd: 'J30.4', symptoms: 'Sneezing, rhinorrhea, itching, congestion, pale turbinates', treatment: 'Cetirizine 10mg daily, Fluticasone nasal BID, allergen avoidance' },
                { name: 'BPPV (Vertigo)', name_ar: 'دوار الوضعة الحميد', icd: 'H81.1', symptoms: 'Brief vertigo with head position change, positive Dix-Hallpike', treatment: 'Epley maneuver, Betahistine 16mg TID, vestibular rehab' },
                { name: 'Otitis Externa', name_ar: 'التهاب الأذن الخارجية', icd: 'H60.9', symptoms: 'Ear pain worse with tragal pressure, itching, discharge', treatment: 'Ciprofloxacin-Dexamethasone drops TID x7d, keep ear dry' },
                { name: 'Epistaxis (Anterior)', name_ar: 'رعاف أنفي أمامي', icd: 'R04.0', symptoms: 'Unilateral nasal bleeding, usually from Little area', treatment: 'Direct pressure 15min, Oxymetazoline, anterior packing if persistent' }
            ],
            'Ophthalmology / العيون': [
                { name: 'Allergic Conjunctivitis', name_ar: 'التهاب الملتحمة التحسسي', icd: 'H10.1', symptoms: 'Bilateral itchy eyes, tearing, redness, seasonal', treatment: 'Olopatadine 0.1% drops BID, cold compresses, oral antihistamine' },
                { name: 'Bacterial Conjunctivitis', name_ar: 'التهاب الملتحمة البكتيري', icd: 'H10.0', symptoms: 'Purulent discharge, crusting, redness, unilateral then bilateral', treatment: 'Moxifloxacin 0.5% drops QID x7d, warm compresses, hand hygiene' },
                { name: 'Dry Eye Syndrome', name_ar: 'جفاف العين', icd: 'H04.1', symptoms: 'Burning, grittiness, foreign body sensation, tearing', treatment: 'Artificial tears QID, warm compresses, omega-3, reduce screen time' },
                { name: 'Stye (Hordeolum)', name_ar: 'الدمل (الشحاذ)', icd: 'H00.0', symptoms: 'Painful red swelling at eyelid margin, tenderness', treatment: 'Warm compresses QID, Chloramphenicol ointment TID, do not squeeze' },
                { name: 'Refractive Error', name_ar: 'خطأ انكساري', icd: 'H52.7', symptoms: 'Blurred vision, headache, eye strain, squinting', treatment: 'Refraction test, prescribe glasses/contact lenses, annual follow-up' }
            ],
            'Dental / الأسنان': [
                { name: 'Dental Caries', name_ar: 'تسوس الأسنان', icd: 'K02.9', symptoms: 'Toothache, sensitivity to hot/cold/sweet, visible cavitation', treatment: 'Dental filling, oral hygiene instructions, fluoride treatment' },
                { name: 'Acute Pulpitis', name_ar: 'التهاب لب السن الحاد', icd: 'K04.0', symptoms: 'Severe spontaneous toothache, worse at night, lingering pain', treatment: 'Root canal or extraction, Ibuprofen 400mg TID, Amoxicillin if infection' },
                { name: 'Periodontal Disease', name_ar: 'أمراض اللثة', icd: 'K05.1', symptoms: 'Gum bleeding, redness, swelling, bad breath, loose teeth', treatment: 'Scaling and root planing, Chlorhexidine mouthwash BID, oral hygiene' },
                { name: 'Periapical Abscess', name_ar: 'خراج حول الذروة', icd: 'K04.7', symptoms: 'Severe pain, swelling, tender to percussion, pus, fever', treatment: 'I&D, Amoxicillin + Metronidazole, root canal or extraction' },
                { name: 'TMJ Disorder', name_ar: 'اضطراب المفصل الصدغي', icd: 'K07.6', symptoms: 'Jaw pain, clicking, limited opening, headache, ear pain', treatment: 'Soft diet, jaw exercises, night guard, NSAIDs, warm compresses' },
                { name: 'Wisdom Tooth Impaction', name_ar: 'ضرس العقل المطمور', icd: 'K01.1', symptoms: 'Pain at angle of jaw, swelling, difficulty opening', treatment: 'Surgical extraction, Amoxicillin, Ibuprofen, chlorhexidine rinse' }
            ],
            'Emergency / الطوارئ': [
                { name: 'Acute MI (STEMI)', name_ar: 'احتشاء عضلة القلب الحاد', icd: 'I21.9', symptoms: 'Crushing chest pain, radiation to jaw/arm, diaphoresis, ST elevation', treatment: 'MONA, Heparin, urgent PCI, cardiology STAT' },
                { name: 'Acute Appendicitis', name_ar: 'التهاب الزائدة الحاد', icd: 'K35.9', symptoms: 'RLQ pain, nausea, fever, McBurney tenderness, Rovsing +', treatment: 'NPO, IV antibiotics, surgical consult STAT, CT if unclear' },
                { name: 'Anaphylaxis', name_ar: 'صدمة حساسية', icd: 'T78.2', symptoms: 'Urticaria, angioedema, bronchospasm, hypotension, dyspnea', treatment: 'Epinephrine 0.3mg IM STAT, IV fluids, diphenhydramine, steroids' },
                { name: 'Acute Stroke', name_ar: 'سكتة دماغية حادة', icd: 'I63.9', symptoms: 'Sudden weakness one side, speech difficulty, facial droop', treatment: 'CT head STAT, tPA if <4.5h, Aspirin 325mg, admit stroke unit' },
                { name: 'Severe Asthma Attack', name_ar: 'نوبة ربو شديدة', icd: 'J46', symptoms: 'Severe dyspnea, unable to speak, SpO2<92%, accessory muscle use', treatment: 'O2, continuous Salbutamol neb, Ipratropium, Methylprednisolone 125mg IV' },
                { name: 'Pneumothorax', name_ar: 'استرواح الصدر', icd: 'J93.9', symptoms: 'Sudden pleuritic pain, dyspnea, decreased breath sounds', treatment: 'Needle decompression if tension, chest tube, CXR, O2, admit' },
                { name: 'Hypoglycemia', name_ar: 'انخفاض السكر', icd: 'E16.2', symptoms: 'Tremor, sweating, confusion, tachycardia, glucose <70', treatment: 'Conscious: 15g oral glucose. Unconscious: Dextrose 50% IV or Glucagon IM' }
            ],
            'Cardiology / القلب': [
                { name: 'Stable Angina', name_ar: 'ذبحة صدرية مستقرة', icd: 'I20.9', symptoms: 'Exertional chest pain, relieved by rest/nitroglycerin', treatment: 'Aspirin 81mg, Atenolol 50mg, Nitroglycerin SL PRN, stress test' },
                { name: 'Atrial Fibrillation', name_ar: 'رجفان أذيني', icd: 'I48.9', symptoms: 'Palpitations, irregular pulse, fatigue, dyspnea', treatment: 'Metoprolol 50mg BID, Rivaroxaban 20mg if CHA2DS2-VASc 2+, echo' },
                { name: 'Hypertensive Crisis', name_ar: 'نوبة ارتفاع ضغط حادة', icd: 'I16.0', symptoms: 'BP >180/120, headache, visual changes, chest pain', treatment: 'Nicardipine IV, lower BP 25% in first hour, ICU/CCU monitoring' }
            ],
            'Urology / المسالك البولية': [
                { name: 'Renal Colic', name_ar: 'مغص كلوي (حصوات)', icd: 'N20.0', symptoms: 'Severe colicky flank pain to groin, hematuria, nausea', treatment: 'Ketorolac 30mg IV, Tamsulosin 0.4mg, hydration, CT KUB, urology referral if >6mm' },
                { name: 'BPH', name_ar: 'تضخم البروستاتا', icd: 'N40.0', symptoms: 'Frequency, urgency, nocturia, weak stream, incomplete emptying', treatment: 'Tamsulosin 0.4mg HS, Finasteride 5mg, PSA, IPSS, urology F/U' },
                { name: 'Acute Pyelonephritis', name_ar: 'التهاب الكلى الحاد', icd: 'N10', symptoms: 'High fever, chills, flank pain, CVA tenderness, dysuria', treatment: 'Ciprofloxacin 500mg BID x14d, blood/urine cultures, hydration' }
            ],
            'Psychiatry / الطب النفسي': [
                { name: 'Major Depressive Disorder', name_ar: 'اضطراب اكتئابي رئيسي', icd: 'F32.9', symptoms: 'Depressed mood >2w, anhedonia, sleep/appetite changes, hopelessness', treatment: 'Sertraline 50mg daily, CBT referral, safety assessment, F/U 2 weeks' },
                { name: 'Generalized Anxiety Disorder', name_ar: 'اضطراب القلق العام', icd: 'F41.1', symptoms: 'Excessive worry >6m, restlessness, muscle tension, insomnia', treatment: 'Escitalopram 10mg daily, CBT, relaxation, regular exercise' },
                { name: 'Insomnia', name_ar: 'اضطراب الأرق', icd: 'G47.0', symptoms: 'Difficulty initiating/maintaining sleep, daytime impairment', treatment: 'Sleep hygiene, CBT-I, Melatonin 3mg HS, Trazodone 50mg if persistent' },
                { name: 'Panic Disorder', name_ar: 'اضطراب الهلع', icd: 'F41.0', symptoms: 'Recurrent panic attacks: palpitations, sweating, trembling, SOB', treatment: 'Sertraline 25-100mg, Alprazolam 0.25mg PRN short-term, CBT' }
            ],
            'OB/GYN / النساء والتوليد': [
                { name: 'Dysmenorrhea', name_ar: 'عسر الطمث', icd: 'N94.6', symptoms: 'Crampy lower abdominal pain with menses, backache, nausea', treatment: 'Ibuprofen 400mg TID before menses, heat pad, OCP if recurrent' },
                { name: 'Vaginal Candidiasis', name_ar: 'التهاب مهبلي فطري', icd: 'B37.3', symptoms: 'Vulvar itching, thick white discharge, erythema, dysuria', treatment: 'Fluconazole 150mg single dose PO, Clotrimazole vaginal cream x7d' },
                { name: 'PCOS', name_ar: 'تكيس المبايض', icd: 'E28.2', symptoms: 'Irregular menses, hirsutism, acne, obesity, infertility', treatment: 'Weight loss, Metformin 500mg BID, OCP for cycles, US pelvis' },
                { name: 'UTI in Pregnancy', name_ar: 'التهاب مسالك أثناء الحمل', icd: 'O23.1', symptoms: 'Dysuria, frequency, urgency in pregnant patient', treatment: 'Nitrofurantoin 100mg BID x7d (avoid 3rd trimester), urine culture' }
            ]
        };
        res.json(templates);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== SAFE PATIENT DELETE (soft delete if has records) =====
app.delete('/api/patients/:id', requireAuth, async (req, res) => {
    try {
        const pid = req.params.id;
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

// ===== PHARMACY STOCK DEDUCTION ON DISPENSE =====
app.post('/api/pharmacy/deduct-stock', requireAuth, async (req, res) => {
    try {
        const { drug_id, drug_name, quantity, patient_id, prescription_id, reason } = req.body;
        const drug = (await pool.query('SELECT * FROM pharmacy_drug_catalog WHERE id=$1', [drug_id])).rows[0];
        if (!drug) return res.status(404).json({ error: 'Drug not found' });
        if (drug.stock_qty < quantity) return res.status(400).json({ error: 'Insufficient stock', available: drug.stock_qty });
        const newQty = drug.stock_qty - quantity;
        await pool.query('UPDATE pharmacy_drug_catalog SET stock_qty=$1 WHERE id=$2', [newQty, drug_id]);
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

// ===== DRUG EXPIRY ALERTS =====
app.get('/api/pharmacy/expiring', requireAuth, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 90;
        const expiring = (await pool.query("SELECT * FROM pharmacy_drug_catalog WHERE is_active=1 AND expiry_date IS NOT NULL AND expiry_date != '' AND expiry_date <= (CURRENT_DATE + INTERVAL '1 day' * $1)::text ORDER BY expiry_date ASC", [days])).rows;
        res.json(expiring);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== INVOICE CANCEL (Credit Note) =====
app.post('/api/invoices/cancel/:id', requireAuth, async (req, res) => {
    try {
        const { reason } = req.body;
        const inv = (await pool.query('SELECT * FROM invoices WHERE id=$1', [req.params.id])).rows[0];
        if (!inv) return res.status(404).json({ error: 'Invoice not found' });
        if (inv.cancelled) return res.status(400).json({ error: 'Already cancelled' });
        await pool.query('UPDATE invoices SET cancelled=1, cancel_reason=$1, cancelled_by=$2, cancelled_at=NOW() WHERE id=$3',
            [reason || '', req.session.user?.display_name || '', req.params.id]);
        logAudit(req.session.user?.id, req.session.user?.display_name, 'CANCEL_INVOICE', 'Finance', 'Cancelled ' + inv.invoice_number + ' (' + inv.total + ' SAR)', req.ip);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== APPOINTMENT CONFLICT CHECK =====
app.get('/api/appointments/check-conflict', requireAuth, async (req, res) => {
    try {
        const { doctor, date, time_slot, exclude_id } = req.query;
        let query = "SELECT * FROM appointments WHERE doctor=$1 AND appointment_date=$2 AND time_slot=$3 AND status != 'Cancelled'";
        let params = [doctor, date, time_slot];
        if (exclude_id) { query += ' AND id != $4'; params.push(exclude_id); }
        const conflicts = (await pool.query(query, params)).rows;
        res.json({ hasConflict: conflicts.length > 0, conflicts });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== NOTIFICATIONS =====
app.get('/api/notifications', requireAuth, async (req, res) => {
    try {
        const role = req.session.user?.role || '';
        const userId = req.session.user?.id;
        const notifs = (await pool.query("SELECT * FROM notifications WHERE (user_id=$1 OR target_role=$2 OR target_role='') ORDER BY created_at DESC LIMIT 50", [userId, role])).rows;
        res.json({ notifications: notifs, unread: notifs.filter(n => !n.is_read).length });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/notifications/:id/read', requireAuth, async (req, res) => {
    try {
        await pool.query('UPDATE notifications SET is_read=1 WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== VISIT TRACKING =====
app.post('/api/visits', requireAuth, async (req, res) => {
    try {
        const { patient_id, visit_type, department, doctor, chief_complaint } = req.body;
        const count = (await pool.query('SELECT COUNT(*) as cnt FROM patient_visits WHERE patient_id=$1', [patient_id])).rows[0].cnt;
        const visitNum = 'V-' + patient_id + '-' + (parseInt(count) + 1);
        const result = await pool.query('INSERT INTO patient_visits (patient_id, visit_number, visit_type, department, doctor, chief_complaint, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [patient_id, visitNum, visit_type || 'Walk-in', department || '', doctor || '', chief_complaint || '', req.session.user?.display_name || '']);
        await pool.query('UPDATE patients SET last_visit_at=NOW(), total_visits=total_visits+1 WHERE id=$1', [patient_id]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/visits/:patient_id', requireAuth, async (req, res) => {
    try {
        res.json((await pool.query('SELECT * FROM patient_visits WHERE patient_id=$1 ORDER BY created_at DESC', [req.params.patient_id])).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== AUDIT TRAIL VIEWER =====
app.get('/api/admin/audit-trail', requireAuth, async (req, res) => {
    try {
        const { module, action, limit: lim } = req.query;
        let query = 'SELECT * FROM audit_trail';
        const conds = [], params = [];
        if (module) { conds.push('module=$' + (params.length + 1)); params.push(module); }
        if (action) { conds.push('action=$' + (params.length + 1)); params.push(action); }
        if (conds.length) query += ' WHERE ' + conds.join(' AND ');
        query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
        params.push(parseInt(lim) || 100);
        res.json((await pool.query(query, params)).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== STOCK MOVEMENT LOG =====
app.get('/api/pharmacy/stock-log', requireAuth, async (req, res) => {
    try {
        res.json((await pool.query('SELECT * FROM pharmacy_stock_log ORDER BY created_at DESC LIMIT 200')).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== NURSING ASSESSMENT SCALES =====
app.post('/api/nursing/assessment', requireAuth, async (req, res) => {
    try {
        const { patient_id, pain_scale, fall_risk_score, braden_score, notes } = req.body;
        const vitals = (await pool.query('SELECT * FROM nursing_vitals WHERE patient_id=$1 ORDER BY id DESC LIMIT 1', [patient_id])).rows[0];
        if (vitals) {
            await pool.query('UPDATE nursing_vitals SET notes=$1 WHERE id=$2', [
                JSON.stringify({ pain_scale, fall_risk_score, braden_score, notes, assessed_at: new Date().toISOString() }),
                vitals.id
            ]);
        }
        res.json({ success: true, pain_scale, fall_risk_score, braden_score });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ===== BACKUP ENDPOINT =====
app.get('/api/admin/backup-info', requireAuth, async (req, res) => {
    try {
        const tables = (await pool.query("SELECT tablename, pg_total_relation_size(quote_ident(tablename)) as size FROM pg_tables WHERE schemaname='public' ORDER BY size DESC")).rows;
        const dbSize = (await pool.query("SELECT pg_database_size(current_database()) as size")).rows[0];
        res.json({
            database: process.env.DB_NAME || 'nama_medical_web',
            totalSize: dbSize.size,
            totalSizeMB: (dbSize.size / 1024 / 1024).toFixed(2),
            tables: tables.map(t => ({ name: t.tablename, sizeMB: (t.size / 1024 / 1024).toFixed(2) })),
            backupCommand: 'pg_dump -U ' + (process.env.DB_USER || 'postgres') + ' -h ' + (process.env.DB_HOST || 'localhost') + ' ' + (process.env.DB_NAME || 'nama_medical_web') + ' > backup.sql'
        });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

startServer();
