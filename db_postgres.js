// PostgreSQL Database Layer - Full schema matching database.js
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'nama_medical_web',
    user: 'postgres',
    password: 'postgres',
    max: 20
});

async function query(sql, params = []) {
    const result = await pool.query(sql, params);
    return result;
}

function getPool() { return pool; }

async function initDatabase() {
    const client = await pool.connect();
    try {
        // ===== CORE TABLES =====
        await client.query(`
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    file_number INTEGER DEFAULT 0,
    name_ar TEXT DEFAULT '', name_en TEXT DEFAULT '',
    national_id TEXT DEFAULT '', phone TEXT DEFAULT '',
    department TEXT DEFAULT '', notes TEXT DEFAULT '',
    amount REAL DEFAULT 0, payment_method TEXT DEFAULT '',
    status TEXT DEFAULT 'Waiting',
    dob TEXT DEFAULT '', dob_hijri TEXT DEFAULT '', age INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER, patient_name TEXT DEFAULT '',
    doctor_name TEXT DEFAULT '', department TEXT DEFAULT '',
    appt_date TEXT DEFAULT '', appt_time TEXT DEFAULT '',
    notes TEXT DEFAULT '', status TEXT DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name TEXT DEFAULT '', name_ar TEXT DEFAULT '', name_en TEXT DEFAULT '',
    role TEXT DEFAULT 'Staff', department_ar TEXT DEFAULT '', department_en TEXT DEFAULT '',
    status TEXT DEFAULT 'Active', salary REAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    patient_name TEXT DEFAULT '', total REAL DEFAULT 0,
    paid INTEGER DEFAULT 0, order_id INTEGER DEFAULT 0,
    service_type TEXT DEFAULT '', invoice_number TEXT DEFAULT '',
    description TEXT DEFAULT '', amount REAL DEFAULT 0,
    vat_amount REAL DEFAULT 0, patient_id INTEGER DEFAULT 0,
    payment_method TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS insurance_companies (
    id SERIAL PRIMARY KEY,
    name_ar TEXT DEFAULT '', name_en TEXT DEFAULT '',
    tpa_id INTEGER DEFAULT 0, contact_info TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS insurance_contracts (
    id SERIAL PRIMARY KEY,
    company_id INTEGER, contract_name TEXT DEFAULT '',
    valid_from TEXT DEFAULT '', valid_to TEXT DEFAULT '',
    discount_percentage REAL DEFAULT 0, file_path TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS insurance_policies (
    id SERIAL PRIMARY KEY,
    name TEXT DEFAULT '', class_type TEXT DEFAULT '',
    max_limit REAL DEFAULT 0, co_pay_percent REAL DEFAULT 0,
    co_pay_max REAL DEFAULT 0, dental_included INTEGER DEFAULT 0,
    optical_included INTEGER DEFAULT 0, maternity_included INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS icd10_codes (
    code TEXT PRIMARY KEY,
    description_en TEXT DEFAULT '', description_ar TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS approvals (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER, service_id INTEGER,
    request_date TEXT DEFAULT '', status TEXT DEFAULT 'Pending',
    approval_number TEXT DEFAULT '', response_date TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS insurance_claims (
    id SERIAL PRIMARY KEY,
    patient_name TEXT DEFAULT '', insurance_company TEXT DEFAULT '',
    claim_amount REAL DEFAULT 0, status TEXT DEFAULT 'Pending',
    contract_id INTEGER DEFAULT 0, policy_id INTEGER DEFAULT 0,
    ucaf_dcaf_data TEXT DEFAULT '', waseel_status TEXT DEFAULT 'Unsent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER, doctor_id INTEGER,
    diagnosis TEXT DEFAULT '', symptoms TEXT DEFAULT '',
    icd10_codes TEXT DEFAULT '', notes TEXT DEFAULT '',
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS prescriptions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER, doctor_id INTEGER, medication_id INTEGER,
    dosage TEXT DEFAULT '', duration TEXT DEFAULT '',
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS medications (
    id SERIAL PRIMARY KEY,
    name TEXT DEFAULT '', active_ingredient TEXT DEFAULT '',
    stock_quantity INTEGER DEFAULT 0, price REAL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS lab_radiology_orders (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER, doctor_id INTEGER,
    order_type TEXT DEFAULT '', description TEXT DEFAULT '',
    status TEXT DEFAULT 'Requested', sample_serial TEXT DEFAULT '',
    result_date TEXT DEFAULT '', sms_sent INTEGER DEFAULT 0,
    results TEXT DEFAULT '', radiology_images_paths TEXT DEFAULT '',
    structured_report TEXT DEFAULT '', is_radiology INTEGER DEFAULT 0,
    price REAL DEFAULT 0, approval_status TEXT DEFAULT 'Pending Approval',
    approved_by TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS dental_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER, tooth_number INTEGER,
    condition TEXT DEFAULT '', treatment_done TEXT DEFAULT '',
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS lab_tests_catalog (
    id SERIAL PRIMARY KEY,
    test_name TEXT DEFAULT '', category TEXT DEFAULT '',
    normal_range TEXT DEFAULT '', price REAL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS lab_results (
    id SERIAL PRIMARY KEY,
    order_id INTEGER, test_id INTEGER,
    result_value TEXT DEFAULT '', is_abnormal INTEGER DEFAULT 0,
    notes TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS radiology_catalog (
    id SERIAL PRIMARY KEY,
    modality TEXT DEFAULT '', exact_name TEXT DEFAULT '',
    default_template TEXT DEFAULT '', price REAL DEFAULT 0
);
        `);

        // ===== PHARMACY TABLES =====
        await client.query(`
CREATE TABLE IF NOT EXISTS pharmacy_prescriptions_queue (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER, doctor_id INTEGER,
    clinic_name TEXT DEFAULT '', prescription_text TEXT DEFAULT '',
    status TEXT DEFAULT 'Pending', dispensed_by TEXT DEFAULT '',
    dispensed_at TIMESTAMP, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS pharmacy_drug_catalog (
    id SERIAL PRIMARY KEY,
    drug_name TEXT DEFAULT '', active_ingredient TEXT DEFAULT '',
    barcode TEXT DEFAULT '', category TEXT DEFAULT '',
    unit TEXT DEFAULT '', selling_price REAL DEFAULT 0,
    cost_price REAL DEFAULT 0, stock_qty INTEGER DEFAULT 0,
    min_qty INTEGER DEFAULT 5, expiry_date TEXT DEFAULT '',
    is_active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS pharmacy_suppliers (
    id SERIAL PRIMARY KEY,
    company_name TEXT DEFAULT '', contact_person TEXT DEFAULT '',
    phone TEXT DEFAULT '', email TEXT DEFAULT '',
    address TEXT DEFAULT '', tax_number TEXT DEFAULT '', notes TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS pharmacy_sales (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER, sale_type TEXT DEFAULT '',
    total_amount REAL DEFAULT 0, discount REAL DEFAULT 0,
    insurance_coverage REAL DEFAULT 0, patient_share REAL DEFAULT 0,
    payment_method TEXT DEFAULT '', cashier TEXT DEFAULT '',
    invoice_number TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS pharmacy_sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER, drug_id INTEGER, qty INTEGER DEFAULT 0,
    unit_price REAL DEFAULT 0, total_price REAL DEFAULT 0,
    bonus_qty INTEGER DEFAULT 0, discount REAL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS pharmacy_purchase_orders (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER, order_date TEXT DEFAULT '',
    total_amount REAL DEFAULT 0, discount REAL DEFAULT 0,
    bonus_value REAL DEFAULT 0, status TEXT DEFAULT 'Draft',
    notes TEXT DEFAULT '', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS pharmacy_purchase_items (
    id SERIAL PRIMARY KEY,
    purchase_id INTEGER, drug_id INTEGER, qty INTEGER DEFAULT 0,
    unit_cost REAL DEFAULT 0, bonus_qty INTEGER DEFAULT 0,
    discount REAL DEFAULT 0, expiry_date TEXT DEFAULT '',
    batch_number TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS pharmacy_opening_balances (
    id SERIAL PRIMARY KEY,
    drug_id INTEGER, qty INTEGER DEFAULT 0,
    unit_cost REAL DEFAULT 0, expiry_date TEXT DEFAULT '',
    batch_number TEXT DEFAULT '',
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
        `);

        // ===== FINANCE TABLES =====
        await client.query(`
CREATE TABLE IF NOT EXISTS finance_chart_of_accounts (
    id SERIAL PRIMARY KEY,
    account_code TEXT DEFAULT '', account_name_ar TEXT DEFAULT '',
    account_name_en TEXT DEFAULT '', parent_id INTEGER DEFAULT 0,
    account_level INTEGER DEFAULT 1, account_type TEXT DEFAULT '',
    is_active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS finance_journal_entries (
    id SERIAL PRIMARY KEY,
    entry_number TEXT DEFAULT '', entry_date TEXT DEFAULT '',
    description TEXT DEFAULT '', reference TEXT DEFAULT '',
    is_auto INTEGER DEFAULT 0, fiscal_year_id INTEGER,
    is_posted INTEGER DEFAULT 0, created_by TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS finance_journal_lines (
    id SERIAL PRIMARY KEY,
    entry_id INTEGER, account_id INTEGER,
    debit REAL DEFAULT 0, credit REAL DEFAULT 0,
    cost_center_id INTEGER DEFAULT 0, notes TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS finance_fiscal_years (
    id SERIAL PRIMARY KEY,
    year_name TEXT DEFAULT '', start_date TEXT DEFAULT '',
    end_date TEXT DEFAULT '', is_closed INTEGER DEFAULT 0,
    closed_at TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS finance_cost_centers (
    id SERIAL PRIMARY KEY,
    center_name TEXT DEFAULT '', center_code TEXT DEFAULT '',
    clinic_id INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS finance_tax_declarations (
    id SERIAL PRIMARY KEY,
    period_start TEXT DEFAULT '', period_end TEXT DEFAULT '',
    total_sales REAL DEFAULT 0, total_vat REAL DEFAULT 0,
    status TEXT DEFAULT 'Draft', submitted_at TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS finance_doctor_commissions (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER, period TEXT DEFAULT '',
    total_revenue REAL DEFAULT 0, commission_rate REAL DEFAULT 0,
    commission_amount REAL DEFAULT 0, status TEXT DEFAULT 'Pending'
);
CREATE TABLE IF NOT EXISTS finance_vouchers (
    id SERIAL PRIMARY KEY,
    voucher_number TEXT DEFAULT '', voucher_type TEXT DEFAULT '',
    amount REAL DEFAULT 0, account_id INTEGER,
    description TEXT DEFAULT '', payment_method TEXT DEFAULT '',
    reference TEXT DEFAULT '', voucher_date TEXT DEFAULT '',
    created_by TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
        `);

        // ===== HR TABLES =====
        await client.query(`
CREATE TABLE IF NOT EXISTS hr_employees (
    id SERIAL PRIMARY KEY,
    emp_number TEXT DEFAULT '', name_ar TEXT DEFAULT '', name_en TEXT DEFAULT '',
    national_id TEXT DEFAULT '', phone TEXT DEFAULT '', email TEXT DEFAULT '',
    department TEXT DEFAULT '', job_title TEXT DEFAULT '',
    hire_date TEXT DEFAULT '', contract_end TEXT DEFAULT '',
    basic_salary REAL DEFAULT 0, housing_allowance REAL DEFAULT 0,
    transport_allowance REAL DEFAULT 0, is_active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS hr_salaries (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER, month TEXT DEFAULT '',
    basic REAL DEFAULT 0, allowances REAL DEFAULT 0,
    deductions REAL DEFAULT 0, advances_deducted REAL DEFAULT 0,
    net_salary REAL DEFAULT 0, payment_date TEXT DEFAULT '',
    status TEXT DEFAULT 'Pending'
);
CREATE TABLE IF NOT EXISTS hr_leaves (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER, leave_type TEXT DEFAULT '',
    start_date TEXT DEFAULT '', end_date TEXT DEFAULT '',
    days INTEGER DEFAULT 0, status TEXT DEFAULT 'Pending',
    approved_by TEXT DEFAULT '', notes TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS hr_advances (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER, amount REAL DEFAULT 0,
    request_date TEXT DEFAULT '', installments INTEGER DEFAULT 1,
    remaining REAL DEFAULT 0, status TEXT DEFAULT 'Pending',
    notes TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS hr_employee_documents (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER, doc_type TEXT DEFAULT '',
    doc_number TEXT DEFAULT '', issue_date TEXT DEFAULT '',
    expiry_date TEXT DEFAULT '', file_path TEXT DEFAULT '',
    alert_days INTEGER DEFAULT 30
);
CREATE TABLE IF NOT EXISTS hr_attendance (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER, attendance_date TEXT DEFAULT '',
    check_in TEXT DEFAULT '', check_out TEXT DEFAULT '',
    total_hours REAL DEFAULT 0, status TEXT DEFAULT 'Present',
    source TEXT DEFAULT 'Manual'
);
CREATE TABLE IF NOT EXISTS hr_employee_custody (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER, item_name TEXT DEFAULT '',
    handed_date TEXT DEFAULT '', returned_date TEXT DEFAULT '',
    status TEXT DEFAULT 'Active', notes TEXT DEFAULT ''
);
        `);

        // ===== INVENTORY TABLES =====
        await client.query(`
CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    item_name TEXT DEFAULT '', item_code TEXT DEFAULT '',
    barcode TEXT DEFAULT '', category TEXT DEFAULT '',
    unit TEXT DEFAULT '', cost_price REAL DEFAULT 0,
    stock_qty INTEGER DEFAULT 0, min_qty INTEGER DEFAULT 5,
    is_active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS inventory_opening_balances (
    id SERIAL PRIMARY KEY, item_id INTEGER,
    qty INTEGER DEFAULT 0, unit_cost REAL DEFAULT 0,
    balance_date TEXT DEFAULT '', notes TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS inventory_purchases (
    id SERIAL PRIMARY KEY, supplier_id INTEGER,
    purchase_date TEXT DEFAULT '', total_amount REAL DEFAULT 0,
    status TEXT DEFAULT 'Received', notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS inventory_purchase_items (
    id SERIAL PRIMARY KEY, purchase_id INTEGER, item_id INTEGER,
    qty INTEGER DEFAULT 0, unit_cost REAL DEFAULT 0, total_cost REAL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS inventory_issue_to_dept (
    id SERIAL PRIMARY KEY, department TEXT DEFAULT '',
    issued_by TEXT DEFAULT '', issue_date TEXT DEFAULT '',
    status TEXT DEFAULT 'Issued', notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS inventory_issue_items (
    id SERIAL PRIMARY KEY, issue_id INTEGER, item_id INTEGER,
    qty INTEGER DEFAULT 0, notes TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS inventory_dept_requests (
    id SERIAL PRIMARY KEY, department TEXT DEFAULT '',
    requested_by TEXT DEFAULT '', request_date TEXT DEFAULT '',
    status TEXT DEFAULT 'Pending', approved_by TEXT DEFAULT '',
    notes TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS inventory_dept_request_items (
    id SERIAL PRIMARY KEY, request_id INTEGER, item_id INTEGER,
    qty_requested INTEGER DEFAULT 0, qty_approved INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS inventory_stock_count (
    id SERIAL PRIMARY KEY, item_id INTEGER,
    counted_qty INTEGER DEFAULT 0, system_qty INTEGER DEFAULT 0,
    difference INTEGER DEFAULT 0, count_date TEXT DEFAULT '',
    counted_by TEXT DEFAULT ''
);
        `);

        // ===== OTHER TABLES =====
        await client.query(`
CREATE TABLE IF NOT EXISTS medical_services (
    id SERIAL PRIMARY KEY,
    name_en TEXT DEFAULT '', name_ar TEXT DEFAULT '',
    specialty TEXT DEFAULT '', category TEXT DEFAULT '',
    price REAL DEFAULT 0, is_active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS form_templates (
    id SERIAL PRIMARY KEY,
    template_name TEXT DEFAULT '', department TEXT DEFAULT '',
    form_fields TEXT DEFAULT '', is_active INTEGER DEFAULT 1,
    created_by TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS internal_messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER, receiver_id INTEGER,
    subject TEXT DEFAULT '', body TEXT DEFAULT '',
    is_read INTEGER DEFAULT 0, priority TEXT DEFAULT 'Normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    package_name_ar TEXT DEFAULT '', package_name_en TEXT DEFAULT '',
    department TEXT DEFAULT '', total_sessions INTEGER DEFAULT 1,
    price REAL DEFAULT 0, is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS package_sessions (
    id SERIAL PRIMARY KEY,
    package_id INTEGER, patient_id INTEGER,
    session_number INTEGER DEFAULT 0, session_date TEXT DEFAULT '',
    status TEXT DEFAULT 'Pending', notes TEXT DEFAULT '',
    performed_by TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS discount_rules (
    id SERIAL PRIMARY KEY,
    rule_name TEXT DEFAULT '', discount_type TEXT DEFAULT 'Percentage',
    discount_value REAL DEFAULT 0, applies_to TEXT DEFAULT 'All',
    min_amount REAL DEFAULT 0, max_discount REAL DEFAULT 0,
    start_date TEXT DEFAULT '', end_date TEXT DEFAULT '',
    is_active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS online_bookings (
    id SERIAL PRIMARY KEY,
    patient_name TEXT DEFAULT '', phone TEXT DEFAULT '',
    email TEXT DEFAULT '', department TEXT DEFAULT '',
    doctor_name TEXT DEFAULT '', preferred_date TEXT DEFAULT '',
    preferred_time TEXT DEFAULT '', status TEXT DEFAULT 'Pending',
    source TEXT DEFAULT 'Online', notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS lab_samples (
    id SERIAL PRIMARY KEY,
    order_id INTEGER, sample_type TEXT DEFAULT '',
    barcode TEXT DEFAULT '', collection_date TEXT DEFAULT '',
    collected_by TEXT DEFAULT '', status TEXT DEFAULT 'Collected',
    storage_location TEXT DEFAULT '', notes TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER, module_name TEXT DEFAULT '',
    can_view INTEGER DEFAULT 0, can_add INTEGER DEFAULT 0,
    can_edit INTEGER DEFAULT 0, can_delete INTEGER DEFAULT 0,
    can_print INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS doctor_inventory_requests (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER, department TEXT DEFAULT '',
    request_date TEXT DEFAULT '', status TEXT DEFAULT 'Pending',
    approved_by TEXT DEFAULT '', notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS doctor_inventory_request_items (
    id SERIAL PRIMARY KEY,
    request_id INTEGER, item_id INTEGER,
    qty_requested INTEGER DEFAULT 0, qty_approved INTEGER DEFAULT 0,
    notes TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS queue_advertisements (
    id SERIAL PRIMARY KEY,
    title TEXT DEFAULT '', image_path TEXT DEFAULT '',
    display_order INTEGER DEFAULT 0, duration_seconds INTEGER DEFAULT 10,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS integration_settings (
    id SERIAL PRIMARY KEY,
    integration_name TEXT DEFAULT '', provider TEXT DEFAULT '',
    api_key TEXT DEFAULT '', api_secret TEXT DEFAULT '',
    endpoint_url TEXT DEFAULT '', is_enabled INTEGER DEFAULT 0,
    config_json TEXT DEFAULT '', last_sync TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS company_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS system_users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL, password_hash TEXT DEFAULT '',
    display_name TEXT DEFAULT '', role TEXT DEFAULT 'Reception',
    speciality TEXT DEFAULT '', permissions TEXT DEFAULT '',
    commission_type TEXT DEFAULT 'percentage',
    commission_value REAL DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS nursing_vitals (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER, patient_name TEXT DEFAULT '',
    bp TEXT DEFAULT '', temp REAL DEFAULT 0,
    weight REAL DEFAULT 0, pulse INTEGER DEFAULT 0,
    o2_sat INTEGER DEFAULT 0, notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS medical_certificates (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER, patient_name TEXT DEFAULT '',
    doctor_id INTEGER, doctor_name TEXT DEFAULT '',
    cert_type TEXT DEFAULT 'sick_leave',
    diagnosis TEXT DEFAULT '', notes TEXT DEFAULT '',
    start_date TEXT DEFAULT '', end_date TEXT DEFAULT '',
    days INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS patient_referrals (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER, patient_name TEXT DEFAULT '',
    from_doctor_id INTEGER, from_doctor TEXT DEFAULT '',
    to_department TEXT DEFAULT '', to_doctor TEXT DEFAULT '',
    reason TEXT DEFAULT '', urgency TEXT DEFAULT 'Normal',
    status TEXT DEFAULT 'Pending', notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
        `);

        // Migration: add commission columns to existing system_users table
        await client.query(`
            DO $$ BEGIN
                ALTER TABLE system_users ADD COLUMN commission_type TEXT DEFAULT 'percentage';
            EXCEPTION WHEN duplicate_column THEN NULL;
            END $$;
            DO $$ BEGIN
                ALTER TABLE system_users ADD COLUMN commission_value REAL DEFAULT 0;
            EXCEPTION WHEN duplicate_column THEN NULL;
            END $$;
        `);

        // Migration: add commission columns to employees table
        await client.query(`
            DO $$ BEGIN
                ALTER TABLE employees ADD COLUMN commission_type TEXT DEFAULT 'percentage';
            EXCEPTION WHEN duplicate_column THEN NULL;
            END $$;
            DO $$ BEGIN
                ALTER TABLE employees ADD COLUMN commission_value REAL DEFAULT 0;
            EXCEPTION WHEN duplicate_column THEN NULL;
            END $$;
        `);

        // Migration: add new nursing vitals columns
        const nursingCols = ['height REAL DEFAULT 0', 'respiratory_rate INTEGER DEFAULT 0', 'blood_sugar INTEGER DEFAULT 0', 'chronic_diseases TEXT DEFAULT \'\'', 'current_medications TEXT DEFAULT \'\'', 'allergies TEXT DEFAULT \'\''];
        for (const col of nursingCols) {
            const colName = col.split(' ')[0];
            await client.query(`DO $$ BEGIN ALTER TABLE nursing_vitals ADD COLUMN ${col}; EXCEPTION WHEN duplicate_column THEN NULL; END $$;`);
        }

        // Migration: add nationality column to patients table
        await client.query(`DO $$ BEGIN ALTER TABLE patients ADD COLUMN nationality TEXT DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END $$;`);

        // Migration: add vat_amount column to invoices table
        await client.query(`DO $$ BEGIN ALTER TABLE invoices ADD COLUMN vat_amount REAL DEFAULT 0; EXCEPTION WHEN duplicate_column THEN NULL; END $$;`);

        // Default settings
        const settingKeys = ['company_name_ar', 'company_name_en', 'tax_number', 'address', 'phone', 'logo_path', 'sample_data_inserted', 'theme'];
        for (const key of settingKeys) {
            await client.query('INSERT INTO company_settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO NOTHING', [key, '']);
        }

        // Default admin
        await client.query(`INSERT INTO system_users (username, password_hash, display_name, role) VALUES ('admin', 'admin', 'المدير العام', 'Admin') ON CONFLICT (username) DO NOTHING`);

        console.log('  ✅ PostgreSQL tables created');
    } finally {
        client.release();
    }
}

module.exports = { pool, query, getPool, initDatabase };
