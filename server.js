const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { getDb, populateLabCatalog } = require('./database');

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
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });
    const db = getDb();
    const user = db.prepare('SELECT id, display_name, role, speciality, permissions FROM system_users WHERE username=? AND password_hash=? AND is_active=1').get(username, password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    req.session.user = { id: user.id, name: user.display_name, role: user.role, speciality: user.speciality || '', permissions: user.permissions || '' };
    res.json({ success: true, user: req.session.user });
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
    if (req.session && req.session.user) return res.json({ user: req.session.user });
    res.status(401).json({ error: 'Not logged in' });
});

// ===== DASHBOARD =====
app.get('/api/dashboard/stats', requireAuth, (req, res) => {
    const db = getDb();
    const patients = db.prepare('SELECT COUNT(*) as cnt FROM patients').get().cnt;
    const revenue = db.prepare('SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=1').get().total;
    const waiting = db.prepare("SELECT COUNT(*) as cnt FROM patients WHERE status='Waiting'").get().cnt;
    const pendingClaims = db.prepare("SELECT COUNT(*) as cnt FROM insurance_claims WHERE status='Pending'").get().cnt;
    const todayAppts = db.prepare("SELECT COUNT(*) as cnt FROM appointments WHERE appt_date=date('now')").get().cnt;
    const employees = db.prepare('SELECT COUNT(*) as cnt FROM employees').get().cnt;
    res.json({ patients, revenue, waiting, pendingClaims, todayAppts, employees });
});

// ===== PATIENTS =====
app.get('/api/patients', requireAuth, (req, res) => {
    const db = getDb();
    const { search } = req.query;
    let rows;
    if (search) {
        rows = db.prepare(`SELECT * FROM patients WHERE name_ar LIKE ? OR name_en LIKE ? OR national_id LIKE ? OR phone LIKE ? OR CAST(file_number AS TEXT) LIKE ? ORDER BY id DESC`)
            .all(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    } else {
        rows = db.prepare('SELECT * FROM patients ORDER BY id DESC').all();
    }
    res.json(rows);
});

app.post('/api/patients', requireAuth, (req, res) => {
    const db = getDb();
    const { name_ar, name_en, national_id, phone, department, amount, payment_method, dob, dob_hijri } = req.body;
    const maxFile = db.prepare('SELECT COALESCE(MAX(file_number), 1000) as mf FROM patients').get().mf;

    let age = 0;
    if (dob) {
        const bd = new Date(dob);
        const ageDifMs = Date.now() - bd.getTime();
        const ageDate = new Date(ageDifMs);
        age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    const result = db.prepare('INSERT INTO patients (file_number, name_ar, name_en, national_id, phone, department, amount, payment_method, dob, dob_hijri, age) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
        .run(maxFile + 1, name_ar || '', name_en || '', national_id || '', phone || '', department || '', amount || 0, payment_method || '', dob || '', dob_hijri || '', age || 0);
    const patient = db.prepare('SELECT * FROM patients WHERE id=?').get(result.lastInsertRowid);
    res.json(patient);
});

app.put('/api/patients/:id', requireAuth, (req, res) => {
    const db = getDb();
    const { department, status } = req.body;
    if (department !== undefined) db.prepare('UPDATE patients SET department=? WHERE id=?').run(department, req.params.id);
    if (status !== undefined) db.prepare('UPDATE patients SET status=? WHERE id=?').run(status, req.params.id);
    const patient = db.prepare('SELECT * FROM patients WHERE id=?').get(req.params.id);
    res.json(patient);
});

app.delete('/api/patients/:id', requireAuth, (req, res) => {
    const db = getDb();
    const id = req.params.id;
    db.prepare('DELETE FROM medical_records WHERE patient_id=?').run(id);
    db.prepare('DELETE FROM lab_radiology_orders WHERE patient_id=?').run(id);
    db.prepare('DELETE FROM prescriptions WHERE patient_id=?').run(id);
    db.prepare('DELETE FROM dental_records WHERE patient_id=?').run(id);
    db.prepare('DELETE FROM appointments WHERE patient_id=?').run(id);
    db.prepare('DELETE FROM approvals WHERE patient_id=?').run(id);
    db.prepare('DELETE FROM patients WHERE id=?').run(id);
    res.json({ success: true });
});

// ===== NURSING =====
app.get('/api/nursing/vitals', requireAuth, (req, res) => {
    res.json(getDb().prepare('SELECT * FROM nursing_vitals ORDER BY id DESC LIMIT 100').all());
});

app.post('/api/nursing/vitals', requireAuth, (req, res) => {
    const db = getDb();
    const { patient_id, patient_name, bp, temp, weight, pulse, o2_sat, notes } = req.body;
    db.prepare('INSERT INTO nursing_vitals (patient_id, patient_name, bp, temp, weight, pulse, o2_sat, notes) VALUES (?,?,?,?,?,?,?,?)')
        .run(patient_id, patient_name || '', bp || '', temp || 0, weight || 0, pulse || 0, o2_sat || 0, notes || '');
    // Change status back to waiting for the doctor
    db.prepare('UPDATE patients SET status=? WHERE id=?').run('Waiting', patient_id);
    res.json({ success: true });
});

// ===== APPOINTMENTS =====
app.get('/api/appointments', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM appointments ORDER BY id DESC').all());
});

app.post('/api/appointments', requireAuth, (req, res) => {
    const db = getDb();
    const { patient_name, doctor_name, department, appt_date, appt_time, notes } = req.body;
    const result = db.prepare('INSERT INTO appointments (patient_name, doctor_name, department, appt_date, appt_time, notes) VALUES (?,?,?,?,?,?)')
        .run(patient_name, doctor_name, department, appt_date, appt_time, notes || '');
    const appt = db.prepare('SELECT * FROM appointments WHERE id=?').get(result.lastInsertRowid);
    res.json(appt);
});

app.delete('/api/appointments/:id', requireAuth, (req, res) => {
    const db = getDb();
    db.prepare('DELETE FROM appointments WHERE id=?').run(req.params.id);
    res.json({ success: true });
});

// ===== EMPLOYEES =====
app.get('/api/employees', requireAuth, (req, res) => {
    const db = getDb();
    const { role } = req.query;
    if (role) {
        res.json(db.prepare('SELECT * FROM employees WHERE role LIKE ? ORDER BY name').all(`%${role}%`));
    } else {
        res.json(db.prepare('SELECT * FROM employees ORDER BY id DESC').all());
    }
});

app.post('/api/employees', requireAuth, (req, res) => {
    const db = getDb();
    const { name, name_ar, name_en, role, department_ar, department_en, salary } = req.body;
    const result = db.prepare('INSERT INTO employees (name, name_ar, name_en, role, department_ar, department_en, salary) VALUES (?,?,?,?,?,?,?)')
        .run(name || name_en, name_ar || '', name_en || '', role || 'Staff', department_ar || '', department_en || '', salary || 0);
    res.json(db.prepare('SELECT * FROM employees WHERE id=?').get(result.lastInsertRowid));
});

app.delete('/api/employees/:id', requireAuth, (req, res) => {
    const db = getDb();
    db.prepare('DELETE FROM employees WHERE id=?').run(req.params.id);
    res.json({ success: true });
});

// ===== INVOICES =====
app.get('/api/invoices', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM invoices ORDER BY id DESC').all());
});

app.post('/api/invoices', requireAuth, (req, res) => {
    const db = getDb();
    const { patient_name, total, description, service_type } = req.body;
    const result = db.prepare('INSERT INTO invoices (patient_name, total, description, service_type) VALUES (?,?,?,?)')
        .run(patient_name, total || 0, description || '', service_type || '');
    res.json(db.prepare('SELECT * FROM invoices WHERE id=?').get(result.lastInsertRowid));
});

// ===== INSURANCE =====
app.get('/api/insurance/companies', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM insurance_companies ORDER BY id DESC').all());
});

app.post('/api/insurance/companies', requireAuth, (req, res) => {
    const db = getDb();
    const { name_ar, name_en, contact_info } = req.body;
    const result = db.prepare('INSERT INTO insurance_companies (name_ar, name_en, contact_info) VALUES (?,?,?)')
        .run(name_ar || '', name_en || '', contact_info || '');
    res.json(db.prepare('SELECT * FROM insurance_companies WHERE id=?').get(result.lastInsertRowid));
});

app.get('/api/insurance/claims', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM insurance_claims ORDER BY id DESC').all());
});

app.post('/api/insurance/claims', requireAuth, (req, res) => {
    const db = getDb();
    const { patient_name, insurance_company, claim_amount } = req.body;
    const result = db.prepare('INSERT INTO insurance_claims (patient_name, insurance_company, claim_amount) VALUES (?,?,?)')
        .run(patient_name, insurance_company, claim_amount || 0);
    res.json(db.prepare('SELECT * FROM insurance_claims WHERE id=?').get(result.lastInsertRowid));
});

app.put('/api/insurance/claims/:id', requireAuth, (req, res) => {
    const db = getDb();
    const { status } = req.body;
    if (status) db.prepare('UPDATE insurance_claims SET status=? WHERE id=?').run(status, req.params.id);
    res.json(db.prepare('SELECT * FROM insurance_claims WHERE id=?').get(req.params.id));
});

app.get('/api/medical/records', requireAuth, (req, res) => {
    const db = getDb();
    const { patient_id } = req.query;
    if (patient_id) {
        res.json(db.prepare('SELECT mr.*, p.name_en as patient_name FROM medical_records mr LEFT JOIN patients p ON mr.patient_id=p.id WHERE mr.patient_id=? ORDER BY mr.id DESC').all(patient_id));
    } else {
        res.json(db.prepare('SELECT mr.*, p.name_en as patient_name FROM medical_records mr LEFT JOIN patients p ON mr.patient_id=p.id ORDER BY mr.id DESC').all());
    }
});

app.post('/api/medical/records', requireAuth, (req, res) => {
    const db = getDb();
    const { patient_id, doctor_id, diagnosis, symptoms, icd10_codes, notes } = req.body;
    const result = db.prepare('INSERT INTO medical_records (patient_id, doctor_id, diagnosis, symptoms, icd10_codes, notes) VALUES (?,?,?,?,?,?)')
        .run(patient_id, doctor_id || 0, diagnosis || '', symptoms || '', icd10_codes || '', notes || '');
    res.json(db.prepare('SELECT * FROM medical_records WHERE id=?').get(result.lastInsertRowid));
});

// ===== MEDICAL SERVICES =====
app.get('/api/medical/services', requireAuth, (req, res) => {
    const db = getDb();
    const { specialty } = req.query;
    if (specialty) {
        res.json(db.prepare('SELECT * FROM medical_services WHERE specialty=? ORDER BY category, name_en').all(specialty));
    } else {
        res.json(db.prepare('SELECT * FROM medical_services ORDER BY specialty, category, name_en').all());
    }
});
app.put('/api/medical/services/:id', requireAuth, (req, res) => {
    const db = getDb();
    const { price } = req.body;
    if (price !== undefined) db.prepare('UPDATE medical_services SET price=? WHERE id=?').run(price, req.params.id);
    res.json(db.prepare('SELECT * FROM medical_services WHERE id=?').get(req.params.id));
});

// ===== CATALOG APIs =====
app.get('/api/catalog/lab', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM lab_tests_catalog ORDER BY category, test_name').all());
});
app.put('/api/catalog/lab/:id', requireAuth, (req, res) => {
    const db = getDb();
    const { price } = req.body;
    if (price !== undefined) db.prepare('UPDATE lab_tests_catalog SET price=? WHERE id=?').run(price, req.params.id);
    res.json(db.prepare('SELECT * FROM lab_tests_catalog WHERE id=?').get(req.params.id));
});
app.get('/api/catalog/radiology', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM radiology_catalog ORDER BY modality, exact_name').all());
});
app.put('/api/catalog/radiology/:id', requireAuth, (req, res) => {
    const db = getDb();
    const { price } = req.body;
    if (price !== undefined) db.prepare('UPDATE radiology_catalog SET price=? WHERE id=?').run(price, req.params.id);
    res.json(db.prepare('SELECT * FROM radiology_catalog WHERE id=?').get(req.params.id));
});

// ===== LAB =====
app.get('/api/lab/orders', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT lo.*, p.name_en as patient_name FROM lab_radiology_orders lo LEFT JOIN patients p ON lo.patient_id=p.id WHERE lo.is_radiology=0 ORDER BY lo.id DESC').all());
});

app.post('/api/lab/orders', requireAuth, (req, res) => {
    const db = getDb();
    const { patient_id, doctor_id, order_type, description, price } = req.body;
    const result = db.prepare('INSERT INTO lab_radiology_orders (patient_id, doctor_id, order_type, description, is_radiology, price) VALUES (?,?,?,?,0,?)')
        .run(patient_id, doctor_id || 0, order_type || '', description || '', price || 0);
    res.json(db.prepare('SELECT * FROM lab_radiology_orders WHERE id=?').get(result.lastInsertRowid));
});

app.get('/api/lab/catalog', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM lab_tests_catalog ORDER BY id').all());
});

app.put('/api/lab/orders/:id', requireAuth, (req, res) => {
    const db = getDb();
    const { status, result } = req.body;
    if (status !== undefined) db.prepare('UPDATE lab_radiology_orders SET status=? WHERE id=?').run(status, req.params.id);
    if (result !== undefined) db.prepare('UPDATE lab_radiology_orders SET results=? WHERE id=?').run(result, req.params.id);
    res.json({ success: true });
});

// ===== RADIOLOGY =====
app.get('/api/radiology/orders', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT lo.*, p.name_en as patient_name FROM lab_radiology_orders lo LEFT JOIN patients p ON lo.patient_id=p.id WHERE lo.is_radiology=1 ORDER BY lo.id DESC').all());
});

app.get('/api/radiology/catalog', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM radiology_catalog ORDER BY id').all());
});

app.put('/api/radiology/orders/:id', requireAuth, (req, res) => {
    const db = getDb();
    const { status, result } = req.body;
    if (status !== undefined) db.prepare('UPDATE lab_radiology_orders SET status=? WHERE id=?').run(status, req.params.id);
    if (result !== undefined) {
        const order = db.prepare('SELECT * FROM lab_radiology_orders WHERE id=?').get(req.params.id);
        const images = (order.results || '').match(/\[IMG:.*?\]/g) || [];
        db.prepare('UPDATE lab_radiology_orders SET results=? WHERE id=?').run(result + '\n' + images.join('\n'), req.params.id);
    }
    res.json({ success: true });
});

app.post('/api/radiology/orders/:id/upload', requireAuth, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const db = getDb();
    const orderId = req.params.id;
    const order = db.prepare('SELECT * FROM lab_radiology_orders WHERE id=?').get(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const imgUrl = `/uploads/radiology/${req.file.filename}`;
    const newResults = (order.results ? order.results + '\n' : '') + `[IMG:${imgUrl}]`;
    db.prepare('UPDATE lab_radiology_orders SET results=? WHERE id=?').run(newResults, orderId);
    res.json({ success: true, imgUrl });
});

// ===== PHARMACY =====
app.get('/api/pharmacy/drugs', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM pharmacy_drug_catalog WHERE is_active=1 ORDER BY drug_name').all());
});

app.post('/api/pharmacy/drugs', requireAuth, (req, res) => {
    const db = getDb();
    const { drug_name, active_ingredient, category, unit, selling_price, cost_price, stock_qty } = req.body;
    const result = db.prepare('INSERT INTO pharmacy_drug_catalog (drug_name, active_ingredient, category, unit, selling_price, cost_price, stock_qty) VALUES (?,?,?,?,?,?,?)')
        .run(drug_name, active_ingredient || '', category || '', unit || '', selling_price || 0, cost_price || 0, stock_qty || 0);
    res.json(db.prepare('SELECT * FROM pharmacy_drug_catalog WHERE id=?').get(result.lastInsertRowid));
});

app.get('/api/pharmacy/queue', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT pq.*, p.name_en as patient_name FROM pharmacy_prescriptions_queue pq LEFT JOIN patients p ON pq.patient_id=p.id ORDER BY pq.id DESC').all());
});

app.put('/api/pharmacy/queue/:id', requireAuth, (req, res) => {
    const db = getDb();
    const { status } = req.body;
    if (status !== undefined) db.prepare('UPDATE pharmacy_prescriptions_queue SET status=?, dispensed_at=CURRENT_TIMESTAMP WHERE id=?').run(status, req.params.id);
    res.json({ success: true });
});

// ===== INVENTORY =====
app.get('/api/inventory/items', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM inventory_items WHERE is_active=1 ORDER BY item_name').all());
});

app.post('/api/inventory/items', requireAuth, (req, res) => {
    const db = getDb();
    const { item_name, item_code, category, unit, cost_price, stock_qty } = req.body;
    const result = db.prepare('INSERT INTO inventory_items (item_name, item_code, category, unit, cost_price, stock_qty) VALUES (?,?,?,?,?,?)')
        .run(item_name, item_code || '', category || '', unit || '', cost_price || 0, stock_qty || 0);
    res.json(db.prepare('SELECT * FROM inventory_items WHERE id=?').get(result.lastInsertRowid));
});

// ===== HR =====
app.get('/api/hr/employees', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM hr_employees WHERE is_active=1 ORDER BY id DESC').all());
});

app.post('/api/hr/employees', requireAuth, (req, res) => {
    const db = getDb();
    const { emp_number, name_ar, name_en, national_id, phone, email, department, job_title, hire_date, basic_salary, housing_allowance, transport_allowance } = req.body;
    const result = db.prepare('INSERT INTO hr_employees (emp_number, name_ar, name_en, national_id, phone, email, department, job_title, hire_date, basic_salary, housing_allowance, transport_allowance) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
        .run(emp_number || '', name_ar || '', name_en || '', national_id || '', phone || '', email || '', department || '', job_title || '', hire_date || '', basic_salary || 0, housing_allowance || 0, transport_allowance || 0);
    res.json(db.prepare('SELECT * FROM hr_employees WHERE id=?').get(result.lastInsertRowid));
});

app.get('/api/hr/salaries', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT hs.*, he.name_en as employee_name FROM hr_salaries hs LEFT JOIN hr_employees he ON hs.employee_id=he.id ORDER BY hs.id DESC').all());
});

app.get('/api/hr/leaves', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT hl.*, he.name_en as employee_name FROM hr_leaves hl LEFT JOIN hr_employees he ON hl.employee_id=he.id ORDER BY hl.id DESC').all());
});

app.get('/api/hr/attendance', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT ha.*, he.name_en as employee_name FROM hr_attendance ha LEFT JOIN hr_employees he ON ha.employee_id=he.id ORDER BY ha.id DESC').all());
});

// ===== FINANCE =====
app.get('/api/finance/accounts', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM finance_chart_of_accounts WHERE is_active=1 ORDER BY account_code').all());
});

app.post('/api/finance/accounts', requireAuth, (req, res) => {
    const db = getDb();
    const { account_code, account_name_ar, account_name_en, parent_id, account_type } = req.body;
    const result = db.prepare('INSERT INTO finance_chart_of_accounts (account_code, account_name_ar, account_name_en, parent_id, account_type) VALUES (?,?,?,?,?)')
        .run(account_code || '', account_name_ar || '', account_name_en || '', parent_id || 0, account_type || '');
    res.json(db.prepare('SELECT * FROM finance_chart_of_accounts WHERE id=?').get(result.lastInsertRowid));
});

app.get('/api/finance/journal', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM finance_journal_entries ORDER BY id DESC').all());
});

app.get('/api/finance/vouchers', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM finance_vouchers ORDER BY id DESC').all());
});

// ===== SETTINGS =====
app.get('/api/settings', requireAuth, (req, res) => {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM company_settings').all();
    const settings = {};
    rows.forEach(r => settings[r.setting_key] = r.setting_value);
    res.json(settings);
});

app.put('/api/settings', requireAuth, (req, res) => {
    const db = getDb();
    const updates = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO company_settings (setting_key, setting_value) VALUES (?, ?)');
    for (const [key, value] of Object.entries(updates)) {
        stmt.run(key, value);
    }
    res.json({ success: true });
});

app.get('/api/settings/users', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT id, username, display_name, role, speciality, permissions, is_active, created_at FROM system_users ORDER BY id').all());
});

app.post('/api/settings/users', requireAuth, (req, res) => {
    const db = getDb();
    const { username, password, display_name, role, speciality, permissions } = req.body;
    const result = db.prepare('INSERT INTO system_users (username, password_hash, display_name, role, speciality, permissions) VALUES (?,?,?,?,?,?)')
        .run(username, password, display_name || '', role || 'Reception', speciality || '', permissions || '');
    res.json(db.prepare('SELECT id, username, display_name, role, speciality, permissions, is_active, created_at FROM system_users WHERE id=?').get(result.lastInsertRowid));
});

app.put('/api/settings/users/:id', requireAuth, (req, res) => {
    const db = getDb();
    const { username, password, display_name, role, speciality, permissions, is_active } = req.body;
    let query = 'UPDATE system_users SET username=?, display_name=?, role=?, speciality=?, permissions=?, is_active=?';
    let params = [username, display_name || '', role || 'Reception', speciality || '', permissions || '', is_active === undefined ? 1 : is_active];

    if (password && password.trim() !== '') {
        query += ', password_hash=?';
        params.push(password);
    }

    query += ' WHERE id=?';
    params.push(req.params.id);

    db.prepare(query).run(...params);
    res.json(db.prepare('SELECT id, username, display_name, role, speciality, permissions, is_active, created_at FROM system_users WHERE id=?').get(req.params.id));
});

app.delete('/api/settings/users/:id', requireAuth, (req, res) => {
    const db = getDb();
    const userId = parseInt(req.params.id);
    if (userId === req.session.user.id) return res.status(400).json({ error: 'Cannot delete your own account' });
    const userRole = db.prepare('SELECT role FROM system_users WHERE id=?').get(userId);
    if (userRole && userRole.role === 'Admin') {
        const adminCount = db.prepare('SELECT COUNT(*) as count FROM system_users WHERE role="Admin"').get().count;
        if (adminCount <= 1) return res.status(400).json({ error: 'Cannot delete the last admin' });
    }
    db.prepare('DELETE FROM system_users WHERE id=?').run(userId);
    res.json({ success: true });
});

// ===== MESSAGING =====
app.get('/api/messages', requireAuth, (req, res) => {
    const db = getDb();
    const userId = req.session.user.id;
    res.json(db.prepare('SELECT im.*, su.display_name as sender_name FROM internal_messages im LEFT JOIN system_users su ON im.sender_id=su.id WHERE im.receiver_id=? ORDER BY im.id DESC').all(userId));
});

app.post('/api/messages', requireAuth, (req, res) => {
    const db = getDb();
    const { receiver_id, subject, body, priority } = req.body;
    const result = db.prepare('INSERT INTO internal_messages (sender_id, receiver_id, subject, body, priority) VALUES (?,?,?,?,?)')
        .run(req.session.user.id, receiver_id, subject || '', body || '', priority || 'Normal');
    res.json(db.prepare('SELECT * FROM internal_messages WHERE id=?').get(result.lastInsertRowid));
});

// ===== ONLINE BOOKINGS =====
app.get('/api/bookings', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare('SELECT * FROM online_bookings ORDER BY id DESC').all());
});

// ===== PRESCRIPTIONS =====
app.get('/api/prescriptions', requireAuth, (req, res) => {
    const db = getDb();
    const { patient_id } = req.query;
    if (patient_id) {
        res.json(db.prepare('SELECT * FROM prescriptions WHERE patient_id=? ORDER BY id DESC').all(patient_id));
    } else {
        res.json(db.prepare('SELECT * FROM prescriptions ORDER BY id DESC').all());
    }
});

app.post('/api/prescriptions', requireAuth, (req, res) => {
    const db = getDb();
    const { patient_id, medication_name, dosage, frequency, duration, notes } = req.body;
    const result = db.prepare('INSERT INTO prescriptions (patient_id, medication_id, dosage, duration, status) VALUES (?,0,?,?,?)')
        .run(patient_id, `${medication_name} ${dosage} ${frequency}`, duration || '', 'Pending');
    // Also add to pharmacy queue
    db.prepare('INSERT INTO pharmacy_prescriptions_queue (patient_id, prescription_text, status) VALUES (?,?,?)')
        .run(patient_id, `${medication_name} - ${dosage} - ${frequency} - ${duration}`, 'Pending');
    res.json(db.prepare('SELECT * FROM prescriptions WHERE id=?').get(result.lastInsertRowid));
});

// ===== RADIOLOGY ORDER CREATION =====
app.post('/api/radiology/orders', requireAuth, (req, res) => {
    const db = getDb();
    const { patient_id, doctor_id, order_type, description, price } = req.body;
    const result = db.prepare('INSERT INTO lab_radiology_orders (patient_id, doctor_id, order_type, description, is_radiology, price) VALUES (?,?,?,?,1,?)')
        .run(patient_id, doctor_id || 0, order_type || '', description || '', price || 0);
    res.json(db.prepare('SELECT * FROM lab_radiology_orders WHERE id=?').get(result.lastInsertRowid));
});

// ===== LAB/RADIOLOGY STATUS UPDATE =====
app.put('/api/lab/orders/:id', requireAuth, (req, res) => {
    const db = getDb();
    const { status, result: testResult } = req.body;
    if (status) db.prepare('UPDATE lab_radiology_orders SET status=? WHERE id=?').run(status, req.params.id);
    if (testResult) db.prepare('UPDATE lab_radiology_orders SET results=? WHERE id=?').run(testResult, req.params.id);
    res.json(db.prepare('SELECT * FROM lab_radiology_orders WHERE id=?').get(req.params.id));
});

app.put('/api/radiology/orders/:id', requireAuth, (req, res) => {
    const db = getDb();
    const { status, result: testResult } = req.body;
    if (status) db.prepare('UPDATE lab_radiology_orders SET status=? WHERE id=?').run(status, req.params.id);
    if (testResult) db.prepare('UPDATE lab_radiology_orders SET results=? WHERE id=?').run(testResult, req.params.id);
    res.json(db.prepare('SELECT * FROM lab_radiology_orders WHERE id=?').get(req.params.id));
});

// ===== RADIOLOGY IMAGE UPLOAD =====
app.post('/api/radiology/orders/:id/upload', requireAuth, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const db = getDb();
    const imagePath = `/uploads/radiology/${req.file.filename}`;
    // Store image path in results field (append if exists)
    const order = db.prepare('SELECT * FROM lab_radiology_orders WHERE id=?').get(req.params.id);
    const existingResults = order?.results || '';
    const imageTag = `[IMG:${imagePath}]`;
    const newResults = existingResults ? `${existingResults}\n${imageTag}` : imageTag;
    db.prepare('UPDATE lab_radiology_orders SET results=? WHERE id=?').run(newResults, req.params.id);
    res.json({ success: true, path: imagePath, order: db.prepare('SELECT * FROM lab_radiology_orders WHERE id=?').get(req.params.id) });
});

// ===== PATIENT RESULTS (for Doctor to browse) =====
app.get('/api/patients/:id/results', requireAuth, (req, res) => {
    const db = getDb();
    const patient = db.prepare('SELECT * FROM patients WHERE id=?').get(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    const labOrders = db.prepare("SELECT * FROM lab_radiology_orders WHERE patient_id=? AND is_radiology=0 ORDER BY created_at DESC").all(req.params.id);
    const radOrders = db.prepare("SELECT * FROM lab_radiology_orders WHERE patient_id=? AND is_radiology=1 ORDER BY created_at DESC").all(req.params.id);
    const records = db.prepare('SELECT * FROM medical_records WHERE patient_id=? ORDER BY visit_date DESC').all(req.params.id);
    res.json({ patient, labOrders, radOrders, records });
});

// ===== PHARMACY QUEUE UPDATE =====
app.put('/api/pharmacy/queue/:id', requireAuth, (req, res) => {
    const db = getDb();
    const { status } = req.body;
    if (status) db.prepare('UPDATE pharmacy_prescriptions_queue SET status=? WHERE id=?').run(status, req.params.id);
    res.json(db.prepare('SELECT * FROM pharmacy_prescriptions_queue WHERE id=?').get(req.params.id));
});

// ===== INVOICES (Enhanced) =====
app.post('/api/invoices/generate', requireAuth, (req, res) => {
    const db = getDb();
    const { patient_id, items } = req.body; // items: [{description, amount}]
    const p = db.prepare('SELECT * FROM patients WHERE id=?').get(patient_id);
    if (!p) return res.status(404).json({ error: 'Patient not found' });
    const total = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
    const description = items.map(i => i.description).join(' | ');
    const result = db.prepare('INSERT INTO invoices (patient_id, patient_name, total, description, service_type) VALUES (?,?,?,?,?)')
        .run(patient_id, p.name_en || p.name_ar, total, description, 'Medical Services');
    res.json(db.prepare('SELECT * FROM invoices WHERE id=?').get(result.lastInsertRowid));
});

app.put('/api/invoices/:id/pay', requireAuth, (req, res) => {
    const db = getDb();
    const { payment_method } = req.body;
    db.prepare('UPDATE invoices SET paid=1, payment_method=? WHERE id=?').run(payment_method || 'Cash', req.params.id);
    res.json(db.prepare('SELECT * FROM invoices WHERE id=?').get(req.params.id));
});

// ===== PATIENT ACCOUNT =====
app.get('/api/patients/:id/account', requireAuth, (req, res) => {
    const db = getDb();
    const id = req.params.id;
    const patient = db.prepare('SELECT * FROM patients WHERE id=?').get(id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    const invoices = db.prepare('SELECT * FROM invoices WHERE patient_id=? ORDER BY id DESC').all(id);
    const records = db.prepare('SELECT * FROM medical_records WHERE patient_id=? ORDER BY id DESC').all(id);
    const labOrders = db.prepare('SELECT * FROM lab_radiology_orders WHERE patient_id=? AND is_radiology=0 ORDER BY id DESC').all(id);
    const radOrders = db.prepare('SELECT * FROM lab_radiology_orders WHERE patient_id=? AND is_radiology=1 ORDER BY id DESC').all(id);
    const prescriptions = db.prepare('SELECT * FROM prescriptions WHERE patient_id=? ORDER BY id DESC').all(id);
    const totalBilled = invoices.reduce((s, i) => s + (i.total || 0), 0);
    const totalPaid = invoices.filter(i => i.paid).reduce((s, i) => s + (i.total || 0), 0);
    res.json({ patient, invoices, records, labOrders, radOrders, prescriptions, totalBilled, totalPaid, balance: totalBilled - totalPaid });
});

// SPA fallback
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== FORM BUILDER =====
app.get('/api/forms', requireAuth, (req, res) => {
    res.json(getDb().prepare('SELECT * FROM form_templates WHERE is_active=1 ORDER BY id DESC').all());
});

app.post('/api/forms', requireAuth, (req, res) => {
    const db = getDb();
    const { template_name, department, form_fields } = req.body;
    const result = db.prepare('INSERT INTO form_templates (template_name, department, form_fields, created_by) VALUES (?,?,?,?)')
        .run(template_name || '', department || '', form_fields || '[]', req.session.user.name || '');
    res.json(db.prepare('SELECT * FROM form_templates WHERE id=?').get(result.lastInsertRowid));
});

app.delete('/api/forms/:id', requireAuth, (req, res) => {
    getDb().prepare('UPDATE form_templates SET is_active=0 WHERE id=?').run(req.params.id);
    res.json({ success: true });
});

// ===== WAITING QUEUE =====
app.get('/api/queue/patients', requireAuth, (req, res) => {
    const db = getDb();
    res.json(db.prepare("SELECT * FROM patients WHERE status IN ('Waiting','With Doctor','With Nurse') ORDER BY id DESC").all());
});

app.put('/api/queue/patients/:id/status', requireAuth, (req, res) => {
    const db = getDb();
    const { status } = req.body;
    db.prepare('UPDATE patients SET status=? WHERE id=?').run(status, req.params.id);
    res.json(db.prepare('SELECT * FROM patients WHERE id=?').get(req.params.id));
});

app.get('/api/queue/ads', requireAuth, (req, res) => {
    res.json(getDb().prepare('SELECT * FROM queue_advertisements WHERE is_active=1 ORDER BY display_order').all());
});

app.post('/api/queue/ads', requireAuth, (req, res) => {
    const db = getDb();
    const { title, image_path, duration_seconds } = req.body;
    const result = db.prepare('INSERT INTO queue_advertisements (title, image_path, duration_seconds) VALUES (?,?,?)')
        .run(title || '', image_path || '', duration_seconds || 10);
    res.json(db.prepare('SELECT * FROM queue_advertisements WHERE id=?').get(result.lastInsertRowid));
});

// ===== PATIENT REFERRAL =====
app.put('/api/patients/:id/referral', requireAuth, (req, res) => {
    const db = getDb();
    const { department } = req.body;
    db.prepare('UPDATE patients SET department=? WHERE id=?').run(department, req.params.id);
    res.json(db.prepare('SELECT * FROM patients WHERE id=?').get(req.params.id));
});

// ===== REPORTS =====
app.get('/api/reports/financial', requireAuth, (req, res) => {
    const db = getDb();
    const totalRevenue = db.prepare('SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=1').get().total;
    const totalPending = db.prepare('SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=0').get().total;
    const invoiceCount = db.prepare('SELECT COUNT(*) as cnt FROM invoices').get().cnt;
    const monthlyRevenue = db.prepare("SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=1 AND created_at >= date('now','start of month')").get().total;
    res.json({ totalRevenue, totalPending, invoiceCount, monthlyRevenue });
});

app.get('/api/reports/patients', requireAuth, (req, res) => {
    const db = getDb();
    const totalPatients = db.prepare('SELECT COUNT(*) as cnt FROM patients').get().cnt;
    const todayPatients = db.prepare("SELECT COUNT(*) as cnt FROM patients WHERE created_at >= date('now')").get().cnt;
    const deptStats = db.prepare('SELECT department, COUNT(*) as cnt FROM patients GROUP BY department ORDER BY cnt DESC').all();
    const statusStats = db.prepare('SELECT status, COUNT(*) as cnt FROM patients GROUP BY status').all();
    res.json({ totalPatients, todayPatients, deptStats, statusStats });
});

app.get('/api/reports/lab', requireAuth, (req, res) => {
    const db = getDb();
    const totalOrders = db.prepare('SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE is_radiology=0').get().cnt;
    const pendingOrders = db.prepare("SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE is_radiology=0 AND status='Requested'").get().cnt;
    const completedOrders = db.prepare("SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE is_radiology=0 AND status='Completed'").get().cnt;
    res.json({ totalOrders, pendingOrders, completedOrders });
});

// ===== ONLINE BOOKINGS MANAGEMENT =====
app.put('/api/bookings/:id', requireAuth, (req, res) => {
    const db = getDb();
    const { status } = req.body;
    db.prepare('UPDATE online_bookings SET status=? WHERE id=?').run(status, req.params.id);
    res.json(db.prepare('SELECT * FROM online_bookings WHERE id=?').get(req.params.id));
});

// Init DB on startup
getDb();
populateLabCatalog();

app.listen(PORT, () => {
    console.log(`\n  ✅ Nama Medical Web is running!`);
    console.log(`  🌐 Open: http://localhost:${PORT}`);
    console.log(`  📦 Database: nama_medical_web.db (SQLite)\n`);
});
