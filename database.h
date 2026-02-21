#pragma once
#include <QDebug>
#include <QMessageBox>
#include <QSqlDatabase>
#include <QSqlDriver>
#include <QSqlError>
#include <QSqlQuery>
#include <QString>
#include <QVariant>

class Database {
public:
  static Database &instance() {
    static Database db;
    return db;
  }

  bool init(const QString & /*sqlitePath*/) {
    if (!connectSqlServer()) {
      QMessageBox::critical(
          nullptr, "Database Error",
          "Failed to connect to SQL Server!\n\n"
          "Please make sure SQL Server is running on localhost\n"
          "and database NAMA_MEDICAL exists.\n\n" +
              m_debugLog);
      return false;
    }
    m_usingSqlServer = true;
    createTables();
    insertSampleData();
    return true;
  }

  bool isSqlServer() const { return true; }
  QString dbType() const { return "SQL Server"; }

  QSqlQuery exec(const QString &sql) {
    QSqlQuery q(m_db);
    if (!q.exec(sql))
      qWarning() << "[DB]" << q.lastError().text() << sql;
    return q;
  }

  QSqlQuery prepare(const QString &sql) {
    QSqlQuery q(m_db);
    q.prepare(sql);
    return q;
  }

private:
  QSqlDatabase m_db;
  bool m_usingSqlServer = true;
  QString m_debugLog;

  bool connectSqlServer() {
    bool hasODBC = QSqlDatabase::isDriverAvailable("QODBC");
    m_debugLog = "QODBC available: " + QString(hasODBC ? "YES" : "NO") + "\n";

    if (!hasODBC) {
      m_debugLog += "QODBC driver not found!\n";
      return false;
    }

    // Windows Authentication - ODBC Driver 17
    QString connString = "DRIVER={ODBC Driver 17 for SQL Server};"
                         "SERVER=localhost;"
                         "DATABASE=NAMA_MEDICAL;"
                         "Trusted_Connection=yes;";

    m_db = QSqlDatabase::addDatabase("QODBC");
    m_db.setDatabaseName(connString);

    if (m_db.open()) {
      qDebug() << "[DB] Connected to SQL Server (Windows Auth)";
      return true;
    }

    m_debugLog += "FAIL: " + m_db.lastError().text() + "\n";
    return false;
  }

  void showDebug() {
    QMessageBox::information(nullptr, "SQL Server Connection Debug",
                             m_debugLog);
  }

  void createTables() {
    QString autoInc = m_usingSqlServer ? "INT IDENTITY(1,1) PRIMARY KEY"
                                       : "INTEGER PRIMARY KEY AUTOINCREMENT";
    QString textType = m_usingSqlServer ? "NVARCHAR(255)" : "TEXT";
    QString realType = m_usingSqlServer ? "DECIMAL(18,2)" : "REAL";
    QString dateType = m_usingSqlServer ? "DATETIME DEFAULT GETDATE()"
                                        : "DATETIME DEFAULT CURRENT_TIMESTAMP";

    auto createTable = [&](const QString &name, const QString &columns) {
      QString sql;
      if (m_usingSqlServer) {
        sql =
            QString("IF NOT EXISTS (SELECT * FROM sys.tables WHERE name='%1') "
                    "CREATE TABLE %1 (%2)")
                .arg(name, columns);
      } else {
        sql = QString("CREATE TABLE IF NOT EXISTS %1 (%2)").arg(name, columns);
      }
      exec(sql);
    };

    // Migration: add missing columns to existing tables
    auto addColumnIfMissing = [&](const QString &table, const QString &column,
                                  const QString &colDef) {
      if (m_usingSqlServer) {
        exec(QString("IF NOT EXISTS (SELECT * FROM sys.columns "
                     "WHERE object_id=OBJECT_ID('%1') AND name='%2') "
                     "ALTER TABLE %1 ADD %2 %3")
                 .arg(table, column, colDef));
      }
    };
    addColumnIfMissing("employees", "name", "NVARCHAR(255) DEFAULT ''");
    addColumnIfMissing("employees", "role", "NVARCHAR(255) DEFAULT 'Staff'");
    // Approval workflow columns
    addColumnIfMissing("lab_radiology_orders", "price",
                       "DECIMAL(18,2) DEFAULT 0");
    addColumnIfMissing("lab_radiology_orders", "approval_status",
                       "NVARCHAR(255) DEFAULT 'Pending Approval'");
    addColumnIfMissing("lab_radiology_orders", "approved_by",
                       "NVARCHAR(255) DEFAULT ''");
    addColumnIfMissing("invoices", "order_id", "INT DEFAULT 0");
    addColumnIfMissing("invoices", "service_type", "NVARCHAR(255) DEFAULT ''");
    addColumnIfMissing("invoices", "invoice_number",
                       "NVARCHAR(255) DEFAULT ''");
    addColumnIfMissing("invoices", "description", "NVARCHAR(255) DEFAULT ''");
    addColumnIfMissing("invoices", "amount", "DECIMAL(18,2) DEFAULT 0");
    addColumnIfMissing("invoices", "vat_amount", "DECIMAL(18,2) DEFAULT 0");
    addColumnIfMissing("invoices", "patient_id", "INT DEFAULT 0");

    // Patient demographic columns
    addColumnIfMissing("patients", "dob", "NVARCHAR(255) DEFAULT ''");
    addColumnIfMissing("patients", "dob_hijri", "NVARCHAR(255) DEFAULT ''");
    addColumnIfMissing("patients", "nationality",
                       "NVARCHAR(255) DEFAULT N'Saudi Arabia'");
    // Backfill file_number for existing patients that have 0
    exec("UPDATE patients SET file_number = 1000 + id WHERE file_number = 0 OR "
         "file_number IS NULL");
    // Clean orphaned invoices & claims (sample data whose patient no longer
    // exists)
    exec("DELETE FROM invoices WHERE patient_name IS NOT NULL "
         "AND patient_name != '' "
         "AND patient_name NOT IN (SELECT name_en FROM patients) "
         "AND patient_name NOT IN (SELECT name_ar FROM patients) "
         "AND (patient_id = 0 OR patient_id IS NULL "
         "OR patient_id NOT IN (SELECT id FROM patients))");
    exec("DELETE FROM insurance_claims WHERE patient_name IS NOT NULL "
         "AND patient_name != '' "
         "AND patient_name NOT IN (SELECT name_en FROM patients) "
         "AND patient_name NOT IN (SELECT name_ar FROM patients)");
    // Backfill name from name_en where empty
    exec("UPDATE employees SET name=name_en WHERE name IS NULL OR name=''");
    // Backfill role for doctors (names starting with Dr.)
    exec("UPDATE employees SET role='Doctor' WHERE (name_en LIKE 'Dr.%' OR "
         "name_en LIKE 'Dr %' OR name_ar LIKE N'%\xd8\xaf.%') AND (role IS "
         "NULL OR role='Staff' OR role='')");

    createTable("patients",
                QString("id %1, file_number INT DEFAULT 0, name_ar %2, name_en "
                        "%2, national_id %2, phone %2, "
                        "dob %2 DEFAULT '', dob_hijri %2 DEFAULT '', "
                        "nationality %2 DEFAULT N'Saudi Arabia', "
                        "department %2 DEFAULT '', notes %2 DEFAULT '', "
                        "amount %3 DEFAULT 0, payment_method %2 DEFAULT '', "
                        "status %2 DEFAULT 'Waiting', created_at %4")
                    .arg(autoInc, textType, realType, dateType));

    createTable(
        "appointments",
        QString(
            "id %1, patient_id INT, patient_name %2, doctor_name %2, "
            "department %2, appt_date %2, appt_time %2, "
            "notes %2 DEFAULT '', status %2 DEFAULT 'Confirmed', created_at %3")
            .arg(autoInc, textType, dateType));

    createTable(
        "employees",
        QString(
            "id %1, name %2, name_ar %2, name_en %2, role %2 DEFAULT 'Staff', "
            "department_ar %2, department_en "
            "%2, "
            "status %2 DEFAULT 'Active', salary %3 DEFAULT 0, created_at %4")
            .arg(autoInc, textType, realType, dateType));

    createTable("invoices", QString("id %1, patient_name %2, total %3, paid "
                                    "INT DEFAULT 0, created_at %4")
                                .arg(autoInc, textType, realType, dateType));

    createTable("insurance_companies",
                QString("id %1, name_ar %2, name_en %2, tpa_id INT DEFAULT 0, "
                        "contact_info %2, created_at %3")
                    .arg(autoInc, textType, dateType));

    createTable(
        "insurance_contracts",
        QString(
            "id %1, company_id INT, contract_name %2, valid_from %2, valid_to "
            "%2, discount_percentage %3 DEFAULT 0, file_path %2, created_at %4")
            .arg(autoInc, textType, realType, dateType));

    createTable("insurance_policies",
                QString("id %1, name %2, class_type %2, max_limit %3 DEFAULT "
                        "0, co_pay_percent %3 DEFAULT 0, co_pay_max %3 DEFAULT "
                        "0, dental_included INT DEFAULT 0, optical_included "
                        "INT DEFAULT 0, maternity_included INT DEFAULT 0")
                    .arg(autoInc, textType, realType));

    createTable(
        "icd10_codes",
        QString("code %1 PRIMARY KEY, description_en %1, description_ar %1")
            .arg(textType));

    createTable(
        "approvals",
        QString(
            "id %1, patient_id INT, service_id INT, request_date %2, status %2 "
            "DEFAULT 'Pending', approval_number %2, response_date %2")
            .arg(autoInc, textType));

    createTable(
        "insurance_claims",
        QString(
            "id %1, patient_name %2, insurance_company %2, claim_amount %3, "
            "status %2 DEFAULT 'Pending', contract_id INT DEFAULT 0, policy_id "
            "INT DEFAULT 0, ucaf_dcaf_data %2, waseel_status %2 DEFAULT "
            "'Unsent', created_at %4")
            .arg(autoInc, textType, realType, dateType));

    createTable("medical_records",
                QString("id %1, patient_id INT, doctor_id INT, diagnosis %2, "
                        "symptoms %2, icd10_codes %2, notes %2, visit_date %3")
                    .arg(autoInc, textType, dateType));

    createTable(
        "prescriptions",
        QString(
            "id %1, patient_id INT, doctor_id INT, medication_id INT, dosage "
            "%2, duration %2, status %2 DEFAULT 'Pending', created_at %3")
            .arg(autoInc, textType, dateType));

    createTable("medications", QString("id %1, name %2, active_ingredient %2, "
                                       "stock_quantity INT DEFAULT 0, price %3")
                                   .arg(autoInc, textType, realType));

    createTable(
        "lab_radiology_orders",
        QString(
            "id %1, patient_id INT, doctor_id INT, order_type %2, description "
            "%2, status %2 DEFAULT 'Requested', sample_serial %2, result_date "
            "%2, sms_sent INT DEFAULT 0, results %2, " // Existing lab fields
            "radiology_images_paths %2, structured_report %2, is_radiology INT "
            "DEFAULT 0, " // New radiology fields
            "created_at %3")
            .arg(autoInc, textType, dateType));

    createTable("dental_records",
                QString("id %1, patient_id INT, tooth_number INT, condition "
                        "%2, treatment_done %2, visit_date %3")
                    .arg(autoInc, textType, dateType));

    createTable(
        "lab_tests_catalog",
        QString("id %1, test_name %2, category %2, normal_range %2, price %3")
            .arg(autoInc, textType, realType));

    createTable("lab_results",
                QString("id %1, order_id INT, test_id INT, result_value %2, "
                        "is_abnormal INT DEFAULT 0, notes %2")
                    .arg(autoInc, textType));

    createTable(
        "radiology_catalog",
        QString(
            "id %1, modality %2, exact_name %2, default_template %2, price %3")
            .arg(autoInc, textType, realType));

    // =============================================
    // PHARMACY MODULE TABLES
    // =============================================
    createTable("pharmacy_prescriptions_queue",
                QString("id %1, patient_id INT, doctor_id INT, clinic_name %2, "
                        "prescription_text %2, status %2 DEFAULT 'Pending', "
                        "dispensed_by %2, dispensed_at %3, created_at %3")
                    .arg(autoInc, textType, dateType));

    createTable(
        "pharmacy_drug_catalog",
        QString("id %1, drug_name %2, active_ingredient %2, barcode %2, "
                "category %2, unit %2, selling_price %3, cost_price %3, "
                "stock_qty INT DEFAULT 0, min_qty INT DEFAULT 5, "
                "expiry_date %2, is_active INT DEFAULT 1")
            .arg(autoInc, textType, realType));

    createTable("pharmacy_suppliers",
                QString("id %1, company_name %2, contact_person %2, phone %2, "
                        "email %2, address %2, tax_number %2, notes %2")
                    .arg(autoInc, textType));

    createTable("pharmacy_sales",
                QString("id %1, patient_id INT, sale_type %2, total_amount %3, "
                        "discount %3, insurance_coverage %3, patient_share %3, "
                        "payment_method %2, cashier %2, invoice_number %2, "
                        "created_at %4")
                    .arg(autoInc, textType, realType, dateType));

    createTable(
        "pharmacy_sale_items",
        QString("id %1, sale_id INT, drug_id INT, qty INT, unit_price %2, "
                "total_price %2, bonus_qty INT DEFAULT 0, discount %2")
            .arg(autoInc, realType));

    createTable(
        "pharmacy_purchase_orders",
        QString("id %1, supplier_id INT, order_date %2, total_amount %3, "
                "discount %3, bonus_value %3, status %2 DEFAULT 'Draft', "
                "notes %2, created_at %4")
            .arg(autoInc, textType, realType, dateType));

    createTable("pharmacy_purchase_items",
                QString("id %1, purchase_id INT, drug_id INT, qty INT, "
                        "unit_cost %3, bonus_qty INT DEFAULT 0, discount %3, "
                        "expiry_date %2, batch_number %2")
                    .arg(autoInc, textType, realType));

    createTable("pharmacy_opening_balances",
                QString("id %1, drug_id INT, qty INT, unit_cost %3, "
                        "expiry_date %2, batch_number %2, entry_date %4")
                    .arg(autoInc, textType, realType, dateType));

    // =============================================
    // FINANCE / ACCOUNTING MODULE TABLES
    // =============================================
    createTable(
        "finance_chart_of_accounts",
        QString(
            "id %1, account_code %2, account_name_ar %2, account_name_en %2, "
            "parent_id INT DEFAULT 0, account_level INT DEFAULT 1, "
            "account_type %2, is_active INT DEFAULT 1")
            .arg(autoInc, textType));

    createTable(
        "finance_journal_entries",
        QString("id %1, entry_number %2, entry_date %2, description %2, "
                "reference %2, is_auto INT DEFAULT 0, fiscal_year_id INT, "
                "is_posted INT DEFAULT 0, created_by %2, created_at %3")
            .arg(autoInc, textType, dateType));

    createTable(
        "finance_journal_lines",
        QString("id %1, entry_id INT, account_id INT, debit %3, credit %3, "
                "cost_center_id INT DEFAULT 0, notes %2")
            .arg(autoInc, textType, realType));

    createTable("finance_fiscal_years",
                QString("id %1, year_name %2, start_date %2, end_date %2, "
                        "is_closed INT DEFAULT 0, closed_at %2")
                    .arg(autoInc, textType));

    createTable("finance_cost_centers",
                QString("id %1, center_name %2, center_code %2, "
                        "clinic_id INT DEFAULT 0, is_active INT DEFAULT 1")
                    .arg(autoInc, textType));

    createTable(
        "finance_tax_declarations",
        QString("id %1, period_start %2, period_end %2, "
                "total_sales %3, total_vat %3, status %2 DEFAULT 'Draft', "
                "submitted_at %2")
            .arg(autoInc, textType, realType));

    createTable("finance_doctor_commissions",
                QString("id %1, doctor_id INT, period %2, total_revenue %3, "
                        "commission_rate %3, commission_amount %3, status %2 "
                        "DEFAULT 'Pending'")
                    .arg(autoInc, textType, realType));

    // =============================================
    // HR / EMPLOYEES MODULE TABLES
    // =============================================
    createTable(
        "hr_employees",
        QString(
            "id %1, emp_number %2, name_ar %2, name_en %2, "
            "national_id %2, phone %2, email %2, department %2, "
            "job_title %2, hire_date %2, contract_end %2, "
            "basic_salary %3, housing_allowance %3, transport_allowance %3, "
            "is_active INT DEFAULT 1")
            .arg(autoInc, textType, realType));

    createTable(
        "hr_salaries",
        QString("id %1, employee_id INT, month %2, basic %3, "
                "allowances %3, deductions %3, advances_deducted %3, "
                "net_salary %3, payment_date %2, status %2 DEFAULT 'Pending'")
            .arg(autoInc, textType, realType));

    createTable("hr_leaves",
                QString("id %1, employee_id INT, leave_type %2, start_date %2, "
                        "end_date %2, days INT, status %2 DEFAULT 'Pending', "
                        "approved_by %2, notes %2")
                    .arg(autoInc, textType));

    createTable("hr_advances",
                QString("id %1, employee_id INT, amount %3, request_date %2, "
                        "installments INT DEFAULT 1, remaining %3, "
                        "status %2 DEFAULT 'Pending', notes %2")
                    .arg(autoInc, textType, realType));

    createTable("hr_employee_documents",
                QString("id %1, employee_id INT, doc_type %2, doc_number %2, "
                        "issue_date %2, expiry_date %2, file_path %2, "
                        "alert_days INT DEFAULT 30")
                    .arg(autoInc, textType));

    createTable(
        "hr_attendance",
        QString("id %1, employee_id INT, attendance_date %2, "
                "check_in %2, check_out %2, total_hours %3, "
                "status %2 DEFAULT 'Present', source %2 DEFAULT 'Manual'")
            .arg(autoInc, textType, realType));

    createTable("hr_employee_custody",
                QString("id %1, employee_id INT, item_name %2, "
                        "handed_date %2, returned_date %2, status %2 DEFAULT "
                        "'Active', notes %2")
                    .arg(autoInc, textType));

    // =============================================
    // INVENTORY / WAREHOUSE MODULE TABLES
    // =============================================
    createTable("inventory_items",
                QString("id %1, item_name %2, item_code %2, barcode %2, "
                        "category %2, unit %2, cost_price %3, "
                        "stock_qty INT DEFAULT 0, min_qty INT DEFAULT 5, "
                        "is_active INT DEFAULT 1")
                    .arg(autoInc, textType, realType));

    createTable("inventory_opening_balances",
                QString("id %1, item_id INT, qty INT, unit_cost %3, "
                        "balance_date %2, notes %2")
                    .arg(autoInc, textType, realType));

    createTable(
        "inventory_purchases",
        QString("id %1, supplier_id INT, purchase_date %2, "
                "total_amount %3, status %2 DEFAULT 'Received', notes %2, "
                "created_at %4")
            .arg(autoInc, textType, realType, dateType));

    createTable("inventory_purchase_items",
                QString("id %1, purchase_id INT, item_id INT, qty INT, "
                        "unit_cost %2, total_cost %2")
                    .arg(autoInc, realType));

    createTable("inventory_issue_to_dept",
                QString("id %1, department %2, issued_by %2, issue_date %2, "
                        "status %2 DEFAULT 'Issued', notes %2, created_at %4")
                    .arg(autoInc, textType, dateType));

    createTable("inventory_issue_items",
                QString("id %1, issue_id INT, item_id INT, qty INT, notes %2")
                    .arg(autoInc, textType));

    createTable(
        "inventory_dept_requests",
        QString("id %1, department %2, requested_by %2, request_date %2, "
                "status %2 DEFAULT 'Pending', approved_by %2, notes %2")
            .arg(autoInc, textType));

    createTable(
        "inventory_dept_request_items",
        QString("id %1, request_id INT, item_id INT, qty_requested INT, "
                "qty_approved INT DEFAULT 0")
            .arg(autoInc));

    createTable("inventory_stock_count",
                QString("id %1, item_id INT, counted_qty INT, system_qty INT, "
                        "difference INT, count_date %2, counted_by %2")
                    .arg(autoInc, textType));

    // =============================================
    // FORM BUILDER
    // =============================================
    createTable("form_templates",
                QString("id %1, template_name %2, department %2, "
                        "form_fields %2, is_active INT DEFAULT 1, "
                        "created_by %2, created_at %3")
                    .arg(autoInc, textType, dateType));

    // =============================================
    // INTERNAL MESSAGING
    // =============================================
    createTable("internal_messages",
                QString("id %1, sender_id INT, receiver_id INT, "
                        "subject %2, body %2, is_read INT DEFAULT 0, "
                        "priority %2 DEFAULT 'Normal', created_at %3")
                    .arg(autoInc, textType, dateType));

    // =============================================
    // PACKAGES & SESSIONS
    // =============================================
    createTable("packages",
                QString("id %1, package_name_ar %2, package_name_en %2, "
                        "department %2, total_sessions INT DEFAULT 1, "
                        "price %3, is_active INT DEFAULT 1, created_at %4")
                    .arg(autoInc, textType, realType, dateType));

    createTable("package_sessions",
                QString("id %1, package_id INT, patient_id INT, "
                        "session_number INT, session_date %2, "
                        "status %2 DEFAULT 'Pending', notes %2, "
                        "performed_by %2")
                    .arg(autoInc, textType));

    // =============================================
    // DISCOUNT RULES
    // =============================================
    createTable(
        "discount_rules",
        QString("id %1, rule_name %2, discount_type %2 DEFAULT 'Percentage', "
                "discount_value %3, applies_to %2 DEFAULT 'All', "
                "min_amount %3 DEFAULT 0, max_discount %3 DEFAULT 0, "
                "start_date %2, end_date %2, is_active INT DEFAULT 1")
            .arg(autoInc, textType, realType));

    // =============================================
    // ONLINE BOOKING (HiOffer)
    // =============================================
    createTable("online_bookings",
                QString("id %1, patient_name %2, phone %2, email %2, "
                        "department %2, doctor_name %2, preferred_date %2, "
                        "preferred_time %2, status %2 DEFAULT 'Pending', "
                        "source %2 DEFAULT 'Online', notes %2, created_at %3")
                    .arg(autoInc, textType, dateType));

    // =============================================
    // FINANCE: RECEIPT & PAYMENT VOUCHERS
    // =============================================
    createTable("finance_vouchers",
                QString("id %1, voucher_number %2, voucher_type %2, "
                        "amount %3, account_id INT, description %2, "
                        "payment_method %2, reference %2, "
                        "voucher_date %2, created_by %2, created_at %4")
                    .arg(autoInc, textType, realType, dateType));

    // =============================================
    // LAB: SAMPLE MANAGEMENT
    // =============================================
    createTable("lab_samples",
                QString("id %1, order_id INT, sample_type %2, "
                        "barcode %2, collection_date %2, "
                        "collected_by %2, status %2 DEFAULT 'Collected', "
                        "storage_location %2, notes %2")
                    .arg(autoInc, textType));

    // =============================================
    // USER PERMISSIONS & ROLES
    // =============================================
    createTable("user_permissions",
                QString("id %1, user_id INT, module_name %2, "
                        "can_view INT DEFAULT 0, can_add INT DEFAULT 0, "
                        "can_edit INT DEFAULT 0, can_delete INT DEFAULT 0, "
                        "can_print INT DEFAULT 0")
                    .arg(autoInc, textType));

    // =============================================
    // DOCTOR INVENTORY REQUESTS
    // =============================================
    createTable("doctor_inventory_requests",
                QString("id %1, doctor_id INT, department %2, "
                        "request_date %2, status %2 DEFAULT 'Pending', "
                        "approved_by %2, notes %2, created_at %3")
                    .arg(autoInc, textType, dateType));

    createTable("doctor_inventory_request_items",
                QString("id %1, request_id INT, item_id INT, "
                        "qty_requested INT, qty_approved INT DEFAULT 0, "
                        "notes %2")
                    .arg(autoInc, textType));

    // =============================================
    // QUEUE: ADVERTISEMENTS
    // =============================================
    createTable(
        "queue_advertisements",
        QString("id %1, title %2, image_path %2, "
                "display_order INT DEFAULT 0, duration_seconds INT DEFAULT 10, "
                "is_active INT DEFAULT 1, created_at %3")
            .arg(autoInc, textType, dateType));

    // =============================================
    // INTEGRATION SETTINGS (SMS, WhatsApp, RASAD, Payment, Signature,
    // Fingerprint)
    // =============================================
    createTable("integration_settings",
                QString("id %1, integration_name %2, provider %2, "
                        "api_key %2, api_secret %2, endpoint_url %2, "
                        "is_enabled INT DEFAULT 0, config_json %2, "
                        "last_sync %2")
                    .arg(autoInc, textType));

    // =============================================
    // COMPANY / ORGANIZATION SETTINGS
    // =============================================
    createTable("company_settings",
                QString("setting_key %1, setting_value %2")
                    .arg(textType + " PRIMARY KEY", textType));

    // Insert default keys if not exist
    auto insertDefault = [&](const QString &key) {
      if (m_usingSqlServer) {
        exec(QString("IF NOT EXISTS (SELECT 1 FROM company_settings WHERE "
                     "setting_key='%1') INSERT INTO company_settings "
                     "(setting_key, setting_value) VALUES ('%1', '')")
                 .arg(key));
      } else {
        exec(QString("INSERT OR IGNORE INTO company_settings (setting_key, "
                     "setting_value) VALUES ('%1', '')")
                 .arg(key));
      }
    };
    insertDefault("company_name_ar");
    insertDefault("company_name_en");
    insertDefault("tax_number");
    insertDefault("address");
    insertDefault("phone");
    insertDefault("logo_path");
    insertDefault("sample_data_inserted");

    // Auto-set flag if DB already has data (existing install)
    if (m_usingSqlServer) {
      exec("UPDATE company_settings SET setting_value='1' "
           "WHERE setting_key='sample_data_inserted' "
           "AND setting_value='' "
           "AND EXISTS (SELECT 1 FROM employees)");
    }

    createTable("hospital_inventory",
                QString("id %1, item_name %2, category %2, quantity %3 "
                        "DEFAULT 0, minimum_stock %3 DEFAULT 0, unit_price "
                        "%3 DEFAULT 0, "
                        "expiry_date %2, last_updated %4")
                    .arg(autoInc, textType, realType, dateType));

    createTable("drugs", QString("id %1, name %2, scientific_name %2, category "
                                 "%2, stock %3 DEFAULT 100, price %3 DEFAULT 0")
                             .arg(autoInc, textType, realType));

    // Pre-populate drug catalog with top Saudi medications if empty
    QSqlQuery qDrugs = exec("SELECT COUNT(*) FROM drugs");
    if (qDrugs.next() && qDrugs.value(0).toInt() == 0) {
      QStringList allDrugs = {
          "Panadol 500mg (Paracetamol) - Analgesic",
          "Fevadol 500mg (Paracetamol) - Analgesic",
          "Brufen 400mg (Ibuprofen) - NSAID",
          "Profenal 400mg (Ibuprofen) - NSAID",
          "Voltaren 50mg (Diclofenac) - NSAID",
          "Cataflam 50mg (Diclofenac Potassium) - NSAID",
          "Aspirin Protect 100mg (Acetylsalicylic acid) - Blood Thinner",
          "Jusprin 81mg (Aspirin) - Blood Thinner",
          "Nexium 40mg (Esomeprazole) - PPI / Antacid",
          "Pariet 20mg (Rabeprazole) - PPI / Antacid",
          "Gaviscon Advance (Sodium Alginate) - Antacid Liquid",
          "Augmentin 1g (Amoxicillin/Clavulanate) - Antibiotic",
          "Klavox 1g (Amoxicillin/Clavulanate) - Antibiotic",
          "Suprax 400mg (Cefixime) - Antibiotic",
          "Zinnat 500mg (Cefuroxime) - Antibiotic",
          "Zithromax 500mg (Azithromycin) - Antibiotic",
          "Ciprofloxacin 500mg (Ciprofloxacin) - Antibiotic",
          "Tavanic 500mg (Levofloxacin) - Antibiotic",
          "Flagyl 500mg (Metronidazole) - Antiprotozoal",
          "Amoxil 500mg (Amoxicillin) - Antibiotic",
          "Lipitor 20mg (Atorvastatin) - Cholesterol",
          "Crestor 10mg (Rosuvastatin) - Cholesterol",
          "Glucophage 500mg (Metformin) - Diabetes",
          "Diamicron MR 60mg (Gliclazide) - Diabetes",
          "Januvia 100mg (Sitagliptin) - Diabetes",
          "Amaryl 2mg (Glimepiride) - Diabetes",
          "Concor 5mg (Bisoprolol) - Blood Pressure",
          "Diovan 160mg (Valsartan) - Blood Pressure",
          "Exforge 5/160mg (Amlodipine/Valsartan) - Blood Pressure",
          "Micardis 80mg (Telmisartan) - Blood Pressure",
          "Amlor 5mg (Amlodipine) - Blood Pressure",
          "Lasix 40mg (Furosemide) - Diuretic",
          "Zyrtec 10mg (Cetirizine) - Antihistamine",
          "Clarinex 5mg (Desloratadine) - Antihistamine",
          "Aerius 5mg (Desloratadine) - Antihistamine",
          "Telfast 120mg (Fexofenadine) - Antihistamine",
          "Singulair 10mg (Montelukast) - Asthma",
          "Symbicort 160/4.5 (Budesonide/Formoterol) - Asthma Inhaler",
          "Ventolin Evohaler 100mcg (Salbutamol) - Asthma Inhaler",
          "Eltroxin 50mcg (Thyroxine) - Thyroid",
          "Cortiment 9mg (Budesonide) - Corticosteroid",
          "Predo 5mg (Prednisolone) - Corticosteroid",
          "Rinza (Paracetamol/Pseudoephedrine) - Cold & Flu",
          "Fludrex (Paracetamol/Chlorpheniramine) - Cold & Flu"};
      for (const QString &d : allDrugs) {
        QStringList parts = d.split(" - ");
        if (parts.size() == 2) {
          QString name = parts[0];
          QString cat = parts[1];
          float price =
              (rand() % 100) + 15.0; // Random price between 15-115 SAR
          exec(QString("INSERT INTO drugs (name, category, price) VALUES "
                       "(N'%1', N'%2', %3)")
                   .arg(name.replace("'", "''"))
                   .arg(cat.replace("'", "''"))
                   .arg(price));
        }
      }
    }

    // Inject Nahdi Online Real-World Scraped Saudi Drugs (Checks existence
    // first)
    QStringList nahdiDrugs = {
        "بانادول اكسترا 24 قرص|مسكنات الألم والحمى|8.00",
        "بانادول أدفانس باراسيتامول 500 مجم 24 قرص|مسكنات الألم والحمى|6.05",
        "أدول باراسيتامول 500 مجم – 24 كبسولة|مسكنات الألم والحمى|5.05",
        "بانادول نايت 20 قرص|مسكنات الألم والحمى|11.60",
        "سولبادين فوار 20 قرص|مسكنات الألم والحمى|13.15",
        "فيفادول 500 مجم 30 قرص|مسكنات الألم والحمى|6.30",
        "كتافاست 50 مجم 9 اكياس|مسكنات الألم والحمى|18.00",
        "فيفادول بلص 20 قرص|مسكنات الألم والحمى|9.65",
        "رابيدوس 50 مجم 20 قرص|مسكنات الألم والحمى|29.10",
        "بانادول اكتيفاست 500 مجم 20 قرص|مسكنات الألم والحمى|9.15",
        "بانادريكس باراسيتامول 500 مجم – 48 قرص|مسكنات الألم والحمى|9.40",
        "بروفين 400مجم 30 قرص|مسكنات الألم والحمى|13.60",
        "سالون باس لصقة للالام صغير 20 حبة|مسكنات الألم والحمى|13.00",
        "بانادول مايجرين 24 قرص|مسكنات الألم والحمى|38.94",
        "روفيناك - د 50 مجم 20 قرص|مسكنات الألم والحمى|29.55",
        "بروفين 600مجم 30قرص|مسكنات الألم والحمى|19.55",
        "ادول اكسترا 24 قرص|مسكنات الألم والحمى|6.40",
        "سولبادين كبسول 20 كبسولة|مسكنات الألم والحمى|13.15",
        "فيفادول اكسترا 20 قرص|مسكنات الألم والحمى|5.80",
        "فولتارين 100 مجم 5تحاميل|مسكنات الألم والحمى|18.20"};
    for (const QString &nd : nahdiDrugs) {
      QStringList parts = nd.split("|");
      if (parts.size() == 3) {
        QString nameStr = QString(parts[0]).replace("'", "''");
        QSqlQuery check =
            exec(QString("SELECT id FROM drugs WHERE name=N'%1'").arg(nameStr));
        if (!check.next()) {
          exec(QString("INSERT INTO drugs (name, category, price) VALUES "
                       "(N'%1', N'%2', %3)")
                   .arg(nameStr)
                   .arg(QString(parts[1]).replace("'", "''"))
                   .arg(parts[2].toFloat()));
        }
      }
    }

    // =============================================
    // SYSTEM USERS (LOGIN & ROLES)
    // =============================================
    createTable("system_users",
                QString("id %1, username %2, password_hash %2, "
                        "display_name %2, role %2 DEFAULT 'Reception', "
                        "is_active INT DEFAULT 1, created_at %3")
                    .arg(autoInc, textType, dateType));

    // Insert default admin if no users exist
    {
      QSqlQuery qu = exec("SELECT COUNT(*) FROM system_users");
      qu.next();
      if (qu.value(0).toInt() == 0) {
        exec("INSERT INTO system_users (username, password_hash, display_name, "
             "role) "
             "VALUES ('admin', 'admin', "
             "N'\xd8\xa7\xd9\x84\xd9\x85\xd8\xaf\xd9\x8a\xd8\xb1 "
             "\xd8\xa7\xd9\x84\xd8\xb9\xd8\xa7\xd9\x85', 'Admin')");
      }
    }
  }

  void insertSampleData() {
    // Check persistent flag – once set, never insert again
    QSqlQuery qFlag = exec("SELECT setting_value FROM company_settings WHERE "
                           "setting_key='sample_data_inserted'");
    if (qFlag.next() && qFlag.value(0).toString() == "1")
      return;

    // Also skip if patients already exist
    QSqlQuery q = exec("SELECT COUNT(*) FROM patients");
    q.next();
    if (q.value(0).toInt() > 0) {
      exec("UPDATE company_settings SET setting_value='1' WHERE "
           "setting_key='sample_data_inserted'");
      return;
    }

    exec("INSERT INTO patients (file_number, name_ar, name_en, national_id, "
         "phone, status) "
         "VALUES "
         "(1001, N'\xd8\xa3\xd8\xad\xd9\x85\xd8\xaf "
         "\xd9\x85\xd8\xad\xd9\x85\xd8\xaf', 'Ahmed Mohammed', '1012345678', "
         "'0551234567', 'With Doctor')");
    exec("INSERT INTO patients (file_number, name_ar, name_en, national_id, "
         "phone, status) "
         "VALUES "
         "(1002, N'\xd8\xb3\xd8\xa7\xd8\xb1\xd8\xa9 "
         "\xd8\xb9\xd8\xa8\xd8\xaf\xd8\xa7\xd9\x84\xd8\xb1\xd8\xad\xd9\x85\xd9"
         "\x86', 'Sarah Abdulrahman', '1098765432', '0559876543', 'Waiting')");
    exec("INSERT INTO patients (file_number, name_ar, name_en, national_id, "
         "phone, status) "
         "VALUES "
         "(1003, N'\xd9\x81\xd9\x8a\xd8\xb5\xd9\x84 "
         "\xd8\xa7\xd9\x84\xd8\xb9\xd8\xaa\xd9\x8a\xd8\xa8\xd9\x8a', 'Faisal "
         "Al-Otaibi', '1054321098', '0553456789', 'Waiting')");

    exec("INSERT INTO employees (name, name_ar, name_en, role, department_ar, "
         "department_en, status, salary) VALUES "
         "('Dr. Khaled Marwan', "
         "N'\xd8\xaf. \xd8\xae\xd8\xa7\xd9\x84\xd8\xaf "
         "\xd9\x85\xd8\xb1\xd9\x88\xd8\xa7\xd9\x86', 'Dr. Khaled Marwan', "
         "'Doctor', "
         "N'\xd8\xa7\xd9\x84\xd9\x82\xd8\xb3\xd9\x85 "
         "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a', 'Medical Dept.', "
         "'Active', 25000)");
    exec("INSERT INTO employees (name, name_ar, name_en, role, department_ar, "
         "department_en, status, salary) VALUES "
         "('Sarah Al-Ahmad', "
         "N'\xd8\xb3\xd8\xa7\xd8\xb1\xd8\xa9 "
         "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xad\xd9\x85\xd8\xaf', 'Sarah Al-Ahmad', "
         "'Nurse', "
         "N'\xd8\xa7\xd9\x84\xd8\xaa\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6', "
         "'Nursing', 'Active', 12000)");
    exec("INSERT INTO employees (name, name_ar, name_en, role, department_ar, "
         "department_en, status, salary) VALUES "
         "('Omar Saleh', "
         "N'\xd8\xb9\xd9\x85\xd8\xb1 \xd8\xb5\xd8\xa7\xd9\x84\xd8\xad', 'Omar "
         "Saleh', 'Admin', "
         "N'\xd8\xaa\xd9\x82\xd9\x86\xd9\x8a\xd8\xa9 "
         "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb9\xd9\x84\xd9\x88\xd9\x85\xd8\xa7\xd8"
         "\xaa', 'IT Dept.', 'On Leave', 9500)");

    exec("INSERT INTO invoices (patient_name, total, paid) VALUES ('Ahmed "
         "Mohammed', 575.00, 1)");
    exec("INSERT INTO invoices (patient_name, total, paid) VALUES ('Yasser "
         "Khaled', 1240.00, 0)");
    exec("INSERT INTO invoices (patient_name, total, paid) VALUES ('Sarah "
         "Ali', 890.50, 1)");

    exec("INSERT INTO insurance_claims (patient_name, insurance_company, "
         "claim_amount, status) VALUES "
         "('Ahmed Mohammed', 'Bupa Arabia', 2500.00, 'Approved')");
    exec("INSERT INTO insurance_claims (patient_name, insurance_company, "
         "claim_amount, status) VALUES "
         "('Yasser Khaled', 'Tawuniya', 4200.00, 'Pending')");
    exec("INSERT INTO insurance_claims (patient_name, insurance_company, "
         "claim_amount, status) VALUES "
         "('Sarah Ali', 'MedGulf', 1800.00, 'Rejected')");

    // Mark sample data as inserted (key always exists from createTables)
    exec("UPDATE company_settings SET setting_value='1' WHERE "
         "setting_key='sample_data_inserted'");
  }
};
