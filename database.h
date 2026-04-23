#pragma once
#include <QCoreApplication>
#include <QDebug>
#include <QMessageBox>
#include <QSettings>
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
          "Please check config.ini settings.\n\n" +
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

    // Read connection settings from config.ini
    QString configPath = QCoreApplication::applicationDirPath() + "/config.ini";
    QSettings settings(configPath, QSettings::IniFormat);
    QString server = settings.value("Database/Server", "localhost").toString();
    QString dbName = settings.value("Database/DatabaseName", "NAMA_MEDICAL").toString();
    QString username = settings.value("Database/Username", "").toString();
    QString password = settings.value("Database/Password", "").toString();

    m_debugLog += "Server: " + server + "\nDatabase: " + dbName + "\n";

    // Build connection string
    QString connString;
    if (username.isEmpty()) {
      // Windows Authentication
      connString = QString("DRIVER={ODBC Driver 17 for SQL Server};"
                           "SERVER=%1;DATABASE=%2;Trusted_Connection=yes;")
                       .arg(server, dbName);
    } else {
      // SQL Server Authentication
      connString = QString("DRIVER={SQL Server};"
                           "SERVER=%1;DATABASE=%2;UID=%3;PWD=%4;")
                       .arg(server, dbName, username, password);
    }

    m_db = QSqlDatabase::addDatabase("QODBC");
    m_db.setDatabaseName(connString);

    if (m_db.open()) {
      qDebug() << "[DB] Connected to SQL Server at" << server;
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

    // =============================================
    // PRE-POPULATE LAB TESTS CATALOG (Mayo Clinic Reference)
    // =============================================
    {
      QSqlQuery qLabCount = exec("SELECT COUNT(*) FROM lab_tests_catalog");
      if (qLabCount.next() && qLabCount.value(0).toInt() == 0) {
        // Format: "TestName|Category|NormalRange|Price"
        QStringList labTests = {
            // ── HEMATOLOGY ──
            "CBC - Complete Blood Count|Hematology|See components|100.00",
            "WBC - White Blood Cell Count|Hematology|4.5-11.0 x10^9/L|50.00",
            "RBC - Red Blood Cell Count|Hematology|M:4.7-6.1 F:4.2-5.4 x10^12/L|50.00",
            "Hemoglobin (Hgb)|Hematology|M:13.5-17.5 F:12.0-16.0 g/dL|50.00",
            "Hematocrit (Hct)|Hematology|M:38.3-48.6% F:35.5-44.9%|50.00",
            "MCV - Mean Corpuscular Volume|Hematology|80-100 fL|40.00",
            "MCH - Mean Corpuscular Hemoglobin|Hematology|27-33 pg|40.00",
            "MCHC|Hematology|31.5-35.7 g/dL|40.00",
            "RDW - Red Cell Distribution Width|Hematology|11.5-14.5%|40.00",
            "Platelet Count|Hematology|150-400 x10^9/L|50.00",
            "MPV - Mean Platelet Volume|Hematology|7.5-11.5 fL|40.00",
            "ESR - Erythrocyte Sedimentation Rate|Hematology|M:0-15 F:0-20 mm/hr|60.00",
            "Reticulocyte Count|Hematology|0.5-2.5%|80.00",
            "Reticulocyte Absolute Count|Hematology|25-125 x10^9/L|80.00",
            "Peripheral Blood Smear|Hematology|Normal morphology|120.00",
            "Hemoglobin Electrophoresis|Hematology|HbA >95%, HbA2 2-3.5%|200.00",
            "G6PD - Glucose-6-Phosphate Dehydrogenase|Hematology|4.6-13.5 U/g Hb|150.00",
            "Sickle Cell Screen|Hematology|Negative|100.00",
            "Direct Coombs Test (DAT)|Hematology|Negative|100.00",
            "Indirect Coombs Test (IAT)|Hematology|Negative|100.00",
            "Osmotic Fragility|Hematology|See reference|180.00",
            "Haptoglobin|Hematology|30-200 mg/dL|120.00",
            "Bone Marrow Biopsy Interpretation|Hematology|See report|500.00",
            "CD4 Count (Flow Cytometry)|Hematology|500-1500 cells/uL|250.00",
            "CD8 Count (Flow Cytometry)|Hematology|150-1000 cells/uL|250.00",

            // ── COAGULATION ──
            "PT - Prothrombin Time|Coagulation|11.0-13.5 seconds|80.00",
            "INR - International Normalized Ratio|Coagulation|0.8-1.1|80.00",
            "aPTT - Activated Partial Thromboplastin Time|Coagulation|25-35 seconds|80.00",
            "D-Dimer|Coagulation|<0.50 mg/L FEU|120.00",
            "Fibrinogen|Coagulation|200-400 mg/dL|100.00",
            "Thrombin Time|Coagulation|14-19 seconds|100.00",
            "Bleeding Time|Coagulation|2-7 minutes|60.00",
            "Factor V Leiden Mutation|Coagulation|Not detected|300.00",
            "Protein C Activity|Coagulation|70-140%|250.00",
            "Protein S Activity|Coagulation|60-140%|250.00",
            "Antithrombin III|Coagulation|80-120%|200.00",
            "Lupus Anticoagulant|Coagulation|Negative|200.00",
            "Anti-Cardiolipin Antibodies (IgG/IgM)|Coagulation|<12 GPL/MPL|200.00",
            "Fibrin Degradation Products (FDP)|Coagulation|<5 ug/mL|120.00",
            "von Willebrand Factor Antigen|Coagulation|50-150%|250.00",

            // ── CHEMISTRY - GENERAL ──
            "Glucose, Fasting|Chemistry|70-100 mg/dL|50.00",
            "Glucose, Random|Chemistry|70-140 mg/dL|50.00",
            "Glucose, 2-Hour Postprandial|Chemistry|<140 mg/dL|60.00",
            "Oral Glucose Tolerance Test (OGTT)|Chemistry|<140 mg/dL at 2hr|120.00",
            "BUN - Blood Urea Nitrogen|Chemistry|7-20 mg/dL|50.00",
            "Creatinine, Serum|Chemistry|M:0.7-1.3 F:0.6-1.1 mg/dL|50.00",
            "eGFR - Estimated Glomerular Filtration Rate|Chemistry|>60 mL/min/1.73m2|50.00",
            "BUN/Creatinine Ratio|Chemistry|10:1-20:1|40.00",
            "Uric Acid|Chemistry|M:3.4-7.0 F:2.4-6.0 mg/dL|60.00",
            "Total Protein, Serum|Chemistry|6.0-8.3 g/dL|50.00",
            "Albumin, Serum|Chemistry|3.5-5.5 g/dL|50.00",
            "Globulin|Chemistry|2.0-3.5 g/dL|50.00",
            "A/G Ratio|Chemistry|1.1-2.2|40.00",
            "BMP - Basic Metabolic Panel|Chemistry|See components|150.00",
            "CMP - Comprehensive Metabolic Panel|Chemistry|See components|200.00",
            "Ammonia Level|Chemistry|15-45 mcg/dL|100.00",
            "Lactate (Lactic Acid)|Chemistry|0.5-2.2 mmol/L|80.00",
            "LDH - Lactate Dehydrogenase|Chemistry|140-280 U/L|70.00",
            "CPK - Creatine Phosphokinase|Chemistry|M:39-308 F:26-192 U/L|80.00",
            "Amylase|Chemistry|28-100 U/L|80.00",
            "Lipase|Chemistry|0-160 U/L|80.00",

            // ── CHEMISTRY - LIVER FUNCTION ──
            "ALT (SGPT)|Liver Function|7-56 U/L|60.00",
            "AST (SGOT)|Liver Function|10-40 U/L|60.00",
            "ALP - Alkaline Phosphatase|Liver Function|44-147 U/L|60.00",
            "GGT - Gamma-Glutamyl Transferase|Liver Function|M:9-48 F:9-36 U/L|60.00",
            "Total Bilirubin|Liver Function|0.1-1.2 mg/dL|60.00",
            "Direct Bilirubin|Liver Function|0.0-0.3 mg/dL|60.00",
            "Indirect Bilirubin|Liver Function|0.1-0.9 mg/dL|50.00",
            "LFT - Liver Function Panel|Liver Function|See components|150.00",
            "Prealbumin (Transthyretin)|Liver Function|20-40 mg/dL|100.00",
            "Alpha-Fetoprotein (Liver)|Liver Function|<10 ng/mL|150.00",

            // ── CHEMISTRY - LIPID PANEL ──
            "Total Cholesterol|Lipid Panel|<200 mg/dL desirable|60.00",
            "LDL Cholesterol|Lipid Panel|<100 mg/dL optimal|60.00",
            "HDL Cholesterol|Lipid Panel|M:>40 F:>50 mg/dL|60.00",
            "Triglycerides|Lipid Panel|<150 mg/dL|60.00",
            "VLDL Cholesterol|Lipid Panel|5-40 mg/dL|60.00",
            "Non-HDL Cholesterol|Lipid Panel|<130 mg/dL|50.00",
            "Lipid Panel (Complete)|Lipid Panel|See components|120.00",
            "Apolipoprotein A1|Lipid Panel|M:104-202 F:108-225 mg/dL|150.00",
            "Apolipoprotein B|Lipid Panel|<90 mg/dL|150.00",
            "Lipoprotein(a)|Lipid Panel|<30 mg/dL|180.00",

            // ── CHEMISTRY - ELECTROLYTES & MINERALS ──
            "Sodium (Na)|Electrolytes|136-145 mEq/L|50.00",
            "Potassium (K)|Electrolytes|3.5-5.0 mEq/L|50.00",
            "Chloride (Cl)|Electrolytes|98-106 mEq/L|50.00",
            "CO2 (Bicarbonate)|Electrolytes|22-29 mEq/L|50.00",
            "Calcium, Total|Electrolytes|8.6-10.2 mg/dL|50.00",
            "Calcium, Ionized|Electrolytes|4.5-5.6 mg/dL|80.00",
            "Phosphorus (Phosphate)|Electrolytes|2.5-4.5 mg/dL|50.00",
            "Magnesium|Electrolytes|1.7-2.2 mg/dL|60.00",
            "Electrolyte Panel|Electrolytes|See components|100.00",
            "Anion Gap|Electrolytes|8-12 mEq/L|40.00",
            "Osmolality, Serum|Electrolytes|275-295 mOsm/kg|80.00",
            "Zinc, Serum|Electrolytes|60-120 mcg/dL|100.00",
            "Copper, Serum|Electrolytes|70-140 mcg/dL|100.00",
            "Ceruloplasmin|Electrolytes|20-60 mg/dL|120.00",

            // ── ENDOCRINOLOGY ──
            "TSH - Thyroid Stimulating Hormone|Endocrinology|0.27-4.20 mIU/L|100.00",
            "Free T4 (Thyroxine)|Endocrinology|0.93-1.70 ng/dL|100.00",
            "Free T3 (Triiodothyronine)|Endocrinology|2.0-4.4 pg/mL|100.00",
            "Total T4|Endocrinology|4.5-12.0 mcg/dL|80.00",
            "Total T3|Endocrinology|80-200 ng/dL|80.00",
            "Thyroglobulin|Endocrinology|<55 ng/mL|150.00",
            "Anti-Thyroid Peroxidase (Anti-TPO)|Endocrinology|<35 IU/mL|120.00",
            "Anti-Thyroglobulin Antibody|Endocrinology|<40 IU/mL|120.00",
            "TSH Receptor Antibody (TRAb)|Endocrinology|<1.75 IU/L|180.00",
            "HbA1c - Glycated Hemoglobin|Endocrinology|4.0-5.6% normal|100.00",
            "Fasting Insulin|Endocrinology|2.6-24.9 mIU/L|120.00",
            "C-Peptide|Endocrinology|1.1-4.4 ng/mL|150.00",
            "Cortisol, Morning|Endocrinology|6.2-19.4 mcg/dL|120.00",
            "Cortisol, Evening|Endocrinology|2.3-11.9 mcg/dL|120.00",
            "ACTH - Adrenocorticotropic Hormone|Endocrinology|7.2-63.3 pg/mL|180.00",
            "Aldosterone, Serum|Endocrinology|<21 ng/dL upright|180.00",
            "Renin Activity (PRA)|Endocrinology|0.25-5.82 ng/mL/hr|180.00",
            "PTH - Parathyroid Hormone|Endocrinology|15-65 pg/mL|150.00",
            "Growth Hormone (GH)|Endocrinology|M:<5 F:<10 ng/mL|180.00",
            "IGF-1 (Somatomedin C)|Endocrinology|Age-dependent|180.00",
            "Prolactin|Endocrinology|M:4-15 F:4-23 ng/mL|120.00",
            "DHEA-S|Endocrinology|Age/sex-dependent|120.00",
            "17-Hydroxyprogesterone|Endocrinology|M:27-199 F:15-70 ng/dL|200.00",
            "Catecholamines, Plasma|Endocrinology|See components|250.00",
            "Metanephrines, Plasma|Endocrinology|Normetanephrine <0.90 nmol/L|250.00",
            "Insulin Antibodies|Endocrinology|<0.4 U/mL|200.00",

            // ── IMMUNOLOGY & SEROLOGY ──
            "CRP - C-Reactive Protein|Immunology|<3.0 mg/L|80.00",
            "hs-CRP - High Sensitivity CRP|Immunology|<1.0 mg/L low risk|100.00",
            "RF - Rheumatoid Factor|Immunology|<14 IU/mL|80.00",
            "Anti-CCP Antibodies|Immunology|<20 U/mL|150.00",
            "ANA - Antinuclear Antibody|Immunology|Negative (<1:40)|120.00",
            "Anti-dsDNA Antibodies|Immunology|<30 IU/mL|150.00",
            "Anti-Smith Antibodies|Immunology|Negative|150.00",
            "ENA Panel (Extractable Nuclear Antigen)|Immunology|Negative|250.00",
            "Complement C3|Immunology|90-180 mg/dL|100.00",
            "Complement C4|Immunology|10-40 mg/dL|100.00",
            "CH50 - Total Complement|Immunology|31-60 U/mL|120.00",
            "Immunoglobulin G (IgG)|Immunology|700-1600 mg/dL|100.00",
            "Immunoglobulin A (IgA)|Immunology|70-400 mg/dL|100.00",
            "Immunoglobulin M (IgM)|Immunology|40-230 mg/dL|100.00",
            "Immunoglobulin E (IgE), Total|Immunology|<100 IU/mL|120.00",
            "ANCA - Anti-Neutrophil Cytoplasmic Ab|Immunology|Negative|200.00",
            "Anti-Phospholipid Antibodies Panel|Immunology|Negative|250.00",
            "Cryoglobulins|Immunology|Not detected|200.00",
            "ASO - Antistreptolysin O|Immunology|<200 IU/mL|80.00",
            "Beta-2 Microglobulin|Immunology|0.7-1.8 mg/L|150.00",
            "Serum Protein Electrophoresis (SPEP)|Immunology|See pattern|200.00",
            "Immunofixation Electrophoresis (IFE)|Immunology|No monoclonal band|250.00",

            // ── MICROBIOLOGY ──
            "Blood Culture, Aerobic|Microbiology|No growth|150.00",
            "Blood Culture, Anaerobic|Microbiology|No growth|150.00",
            "Urine Culture & Sensitivity|Microbiology|<10,000 CFU/mL|120.00",
            "Wound Culture & Sensitivity|Microbiology|See report|120.00",
            "Throat Culture|Microbiology|Normal flora|100.00",
            "Sputum Culture & Sensitivity|Microbiology|See report|120.00",
            "Stool Culture|Microbiology|No pathogen|120.00",
            "CSF Culture|Microbiology|No growth|150.00",
            "Fungal Culture|Microbiology|No growth|150.00",
            "AFB Culture (Tuberculosis)|Microbiology|No growth|200.00",
            "AFB Smear (Acid-Fast Bacilli)|Microbiology|Negative|80.00",
            "Gram Stain|Microbiology|See report|60.00",
            "KOH Preparation|Microbiology|Negative|50.00",
            "Chlamydia trachomatis PCR|Microbiology|Not detected|200.00",
            "Neisseria gonorrhoeae PCR|Microbiology|Not detected|200.00",
            "H. pylori Antigen, Stool|Microbiology|Negative|120.00",
            "H. pylori Antibody, Serum|Microbiology|Negative|100.00",
            "H. pylori Breath Test (Urea)|Microbiology|Negative|150.00",
            "Clostridium difficile Toxin|Microbiology|Negative|150.00",
            "MRSA Screen|Microbiology|Not detected|150.00",

            // ── URINALYSIS ──
            "Urinalysis, Complete|Urinalysis|See components|60.00",
            "Urine Dipstick|Urinalysis|See components|40.00",
            "Urine Microscopy|Urinalysis|See report|50.00",
            "Urine Protein, Random|Urinalysis|<150 mg/day|60.00",
            "Urine Protein/Creatinine Ratio|Urinalysis|<0.2 mg/mg|80.00",
            "Urine Albumin/Creatinine Ratio (UACR)|Urinalysis|<30 mg/g|100.00",
            "24-Hour Urine Protein|Urinalysis|<150 mg/24hr|100.00",
            "24-Hour Urine Creatinine Clearance|Urinalysis|M:97-137 F:88-128 mL/min|120.00",
            "Urine Electrolytes (Na, K, Cl)|Urinalysis|See components|100.00",
            "Urine Calcium, 24-Hour|Urinalysis|100-300 mg/24hr|100.00",
            "Urine Uric Acid, 24-Hour|Urinalysis|250-750 mg/24hr|100.00",
            "Urine Osmolality|Urinalysis|300-900 mOsm/kg|80.00",
            "Urine pH|Urinalysis|4.5-8.0|30.00",
            "Urine Specific Gravity|Urinalysis|1.005-1.030|30.00",
            "Urine Drug Screen|Urinalysis|Negative|150.00",

            // ── TOXICOLOGY & DRUG MONITORING ──
            "Urine Drug Screen Panel|Toxicology|Negative|200.00",
            "Acetaminophen Level|Toxicology|10-30 mcg/mL therapeutic|100.00",
            "Salicylate Level|Toxicology|15-30 mg/dL therapeutic|100.00",
            "Ethanol (Alcohol) Level|Toxicology|0 mg/dL|80.00",
            "Digoxin Level|Toxicology|0.8-2.0 ng/mL|120.00",
            "Lithium Level|Toxicology|0.6-1.2 mEq/L|100.00",
            "Valproic Acid Level|Toxicology|50-100 mcg/mL|120.00",
            "Phenytoin Level|Toxicology|10-20 mcg/mL|120.00",
            "Carbamazepine Level|Toxicology|4-12 mcg/mL|120.00",
            "Theophylline Level|Toxicology|10-20 mcg/mL|120.00",
            "Vancomycin Trough|Toxicology|15-20 mcg/mL|150.00",
            "Gentamicin Level|Toxicology|Peak 5-10 mcg/mL|150.00",
            "Methotrexate Level|Toxicology|See protocol|200.00",
            "Tacrolimus (FK506) Level|Toxicology|5-15 ng/mL|200.00",
            "Cyclosporine Level|Toxicology|150-300 ng/mL|200.00",
            "Lead Level, Blood|Toxicology|<5 mcg/dL|150.00",
            "Mercury Level, Blood|Toxicology|<10 mcg/L|200.00",

            // ── TUMOR MARKERS ──
            "PSA - Prostate Specific Antigen|Tumor Markers|<4.0 ng/mL|120.00",
            "Free PSA / Total PSA Ratio|Tumor Markers|>25% low risk|150.00",
            "AFP - Alpha-Fetoprotein|Tumor Markers|<10 ng/mL|150.00",
            "CEA - Carcinoembryonic Antigen|Tumor Markers|<3.0 ng/mL non-smoker|150.00",
            "CA-125|Tumor Markers|<35 U/mL|150.00",
            "CA 19-9|Tumor Markers|<37 U/mL|150.00",
            "CA 15-3|Tumor Markers|<30 U/mL|150.00",
            "CA 72-4|Tumor Markers|<6.9 U/mL|180.00",
            "HE4 (Human Epididymis Protein 4)|Tumor Markers|<70 pmol/L premenopause|200.00",
            "Beta-hCG (Tumor Marker)|Tumor Markers|<5 mIU/mL non-pregnant|120.00",
            "NSE - Neuron-Specific Enolase|Tumor Markers|<16.3 ng/mL|180.00",
            "Chromogranin A|Tumor Markers|<93 ng/mL|200.00",
            "5-HIAA, 24-Hour Urine|Tumor Markers|2-8 mg/24hr|200.00",
            "Calcitonin|Tumor Markers|M:<8.4 F:<5.0 pg/mL|200.00",

            // ── BLOOD BANK ──
            "Blood Group & Rh Type|Blood Bank|A/B/AB/O, Rh+/-|50.00",
            "Antibody Screen (Indirect Coombs)|Blood Bank|Negative|80.00",
            "Crossmatch|Blood Bank|Compatible|100.00",
            "Direct Antiglobulin Test (DAT)|Blood Bank|Negative|80.00",
            "Antibody Identification Panel|Blood Bank|See report|200.00",
            "Kleihauer-Betke Test|Blood Bank|See report|150.00",
            "Cold Agglutinins|Blood Bank|<1:64|120.00",
            "Warm Autoantibodies|Blood Bank|Negative|150.00",

            // ── VITAMINS & NUTRITION ──
            "Vitamin D, 25-Hydroxy|Vitamins|30-100 ng/mL|120.00",
            "Vitamin D, 1,25-Dihydroxy|Vitamins|18-72 pg/mL|200.00",
            "Vitamin B12 (Cobalamin)|Vitamins|200-900 pg/mL|100.00",
            "Folate (Folic Acid), Serum|Vitamins|>3.0 ng/mL|80.00",
            "Folate, RBC|Vitamins|>280 ng/mL|120.00",
            "Iron, Serum|Vitamins|M:60-170 F:40-150 mcg/dL|60.00",
            "TIBC - Total Iron Binding Capacity|Vitamins|250-400 mcg/dL|60.00",
            "Transferrin Saturation|Vitamins|20-50%|60.00",
            "Ferritin|Vitamins|M:12-300 F:12-150 ng/mL|80.00",
            "Vitamin A (Retinol)|Vitamins|30-65 mcg/dL|150.00",
            "Vitamin C (Ascorbic Acid)|Vitamins|0.2-2.0 mg/dL|120.00",
            "Vitamin E (Alpha-Tocopherol)|Vitamins|5.5-17.0 mg/L|150.00",
            "Vitamin B1 (Thiamine)|Vitamins|70-180 nmol/L|150.00",
            "Vitamin B6 (Pyridoxine)|Vitamins|5-50 mcg/L|150.00",

            // ── CARDIAC MARKERS ──
            "Troponin I|Cardiac Markers|<0.04 ng/mL|120.00",
            "Troponin T, High Sensitivity|Cardiac Markers|<14 ng/L|150.00",
            "BNP - B-Type Natriuretic Peptide|Cardiac Markers|<100 pg/mL|150.00",
            "NT-proBNP|Cardiac Markers|<125 pg/mL (<75yr)|180.00",
            "CK-MB (Creatine Kinase-MB)|Cardiac Markers|<5.0 ng/mL|100.00",
            "Myoglobin|Cardiac Markers|<90 ng/mL|100.00",
            "Homocysteine|Cardiac Markers|5-15 umol/L|120.00",
            "Lipoprotein-Associated Phospholipase A2|Cardiac Markers|<200 ng/mL|200.00",

            // ── ALLERGY (IgE) ──
            "Total IgE|Allergy|<100 IU/mL adult|100.00",
            "Specific IgE - Dust Mite|Allergy|<0.35 kU/L|120.00",
            "Specific IgE - Cat Dander|Allergy|<0.35 kU/L|120.00",
            "Specific IgE - Dog Dander|Allergy|<0.35 kU/L|120.00",
            "Specific IgE - Grass Pollen|Allergy|<0.35 kU/L|120.00",
            "Specific IgE - Tree Pollen|Allergy|<0.35 kU/L|120.00",
            "Specific IgE - Mold Mix|Allergy|<0.35 kU/L|120.00",
            "Specific IgE - Milk|Allergy|<0.35 kU/L|120.00",
            "Specific IgE - Egg White|Allergy|<0.35 kU/L|120.00",
            "Specific IgE - Peanut|Allergy|<0.35 kU/L|120.00",
            "Specific IgE - Wheat|Allergy|<0.35 kU/L|120.00",
            "Specific IgE - Soybean|Allergy|<0.35 kU/L|120.00",
            "Specific IgE - Fish Mix|Allergy|<0.35 kU/L|120.00",
            "Specific IgE - Shellfish Mix|Allergy|<0.35 kU/L|120.00",
            "Specific IgE - Latex|Allergy|<0.35 kU/L|120.00",
            "Food Allergy Panel (Top 8)|Allergy|See components|400.00",
            "Inhalant Allergy Panel|Allergy|See components|400.00",

            // ── STOOL ANALYSIS ──
            "Stool Analysis, Complete|Stool Analysis|See components|80.00",
            "Stool Occult Blood (FOBT)|Stool Analysis|Negative|50.00",
            "FIT - Fecal Immunochemical Test|Stool Analysis|Negative|80.00",
            "Stool Ova & Parasites (O&P)|Stool Analysis|No parasites seen|80.00",
            "Stool Reducing Substances|Stool Analysis|Negative|60.00",
            "Fecal Calprotectin|Stool Analysis|<50 mcg/g|200.00",
            "Fecal Elastase|Stool Analysis|>200 mcg/g normal|180.00",
            "Stool Fat (Sudan Stain)|Stool Analysis|Negative|60.00",
            "Fecal Fat, Quantitative (72-hr)|Stool Analysis|<7 g/24hr|200.00",
            "Stool Lactoferrin|Stool Analysis|Negative|150.00",

            // ── GENETICS & MOLECULAR ──
            "COVID-19 PCR (SARS-CoV-2)|Molecular|Not detected|200.00",
            "COVID-19 Rapid Antigen|Molecular|Negative|100.00",
            "COVID-19 Antibody (IgG)|Molecular|See interpretation|150.00",
            "Influenza A/B PCR|Molecular|Not detected|200.00",
            "RSV PCR|Molecular|Not detected|200.00",
            "Respiratory Pathogen Panel (RPP)|Molecular|See components|500.00",
            "TB QuantiFERON (IGRA)|Molecular|Negative|250.00",
            "TB Skin Test (PPD) Interpretation|Molecular|<5mm negative|50.00",
            "Hepatitis B PCR (HBV DNA)|Molecular|Not detected|300.00",
            "Hepatitis C PCR (HCV RNA)|Molecular|Not detected|300.00",
            "Hepatitis C Genotype|Molecular|See report|400.00",
            "HIV-1 RNA Viral Load|Molecular|Not detected|350.00",
            "CMV PCR (Cytomegalovirus)|Molecular|Not detected|250.00",
            "EBV PCR (Epstein-Barr Virus)|Molecular|Not detected|250.00",
            "HPV DNA Test|Molecular|Not detected|200.00",
            "BRCA1/BRCA2 Mutation Analysis|Molecular|No pathogenic variant|2000.00",
            "Karyotype Analysis|Molecular|46,XX or 46,XY|500.00",
            "Cystic Fibrosis Mutation Panel|Molecular|No mutations detected|400.00",

            // ── CSF & BODY FLUIDS ──
            "CSF Analysis (Cell Count, Protein, Glucose)|Body Fluids|See components|200.00",
            "CSF Protein|Body Fluids|15-45 mg/dL|80.00",
            "CSF Glucose|Body Fluids|40-70 mg/dL|60.00",
            "CSF Cell Count & Differential|Body Fluids|0-5 WBC/uL|80.00",
            "CSF Gram Stain|Body Fluids|No organisms|50.00",
            "CSF Oligoclonal Bands|Body Fluids|Not detected|250.00",
            "Pleural Fluid Analysis|Body Fluids|See components|200.00",
            "Synovial Fluid Analysis|Body Fluids|See components|200.00",
            "Ascitic Fluid Analysis|Body Fluids|See components|200.00",
            "Pericardial Fluid Analysis|Body Fluids|See components|200.00",
            "SAAG (Serum-Ascites Albumin Gradient)|Body Fluids|>1.1 g/dL portal HTN|80.00",

            // ── REPRODUCTIVE HORMONES ──
            "Estradiol (E2)|Reproductive Hormones|Phase-dependent|120.00",
            "Progesterone|Reproductive Hormones|Phase-dependent|120.00",
            "Testosterone, Total|Reproductive Hormones|M:264-916 ng/dL|120.00",
            "Testosterone, Free|Reproductive Hormones|M:8.7-25.1 pg/mL|150.00",
            "FSH - Follicle Stimulating Hormone|Reproductive Hormones|Phase/sex-dependent|120.00",
            "LH - Luteinizing Hormone|Reproductive Hormones|Phase/sex-dependent|120.00",
            "AMH - Anti-Mullerian Hormone|Reproductive Hormones|Age-dependent|200.00",
            "Beta-hCG (Pregnancy)|Reproductive Hormones|<5 mIU/mL non-pregnant|100.00",
            "Progesterone, 21-Day|Reproductive Hormones|>10 ng/mL ovulation|120.00",
            "SHBG - Sex Hormone Binding Globulin|Reproductive Hormones|M:10-57 F:18-114 nmol/L|150.00",
            "Estriol, Unconjugated (uE3)|Reproductive Hormones|Gestational age-dependent|150.00",
            "Inhibin B|Reproductive Hormones|Age/sex-dependent|200.00",
            "Androstenedione|Reproductive Hormones|0.4-3.4 ng/mL|150.00",

            // ── INFECTIOUS DISEASE SEROLOGY ──
            "HBsAg - Hepatitis B Surface Antigen|Infectious Disease|Negative|80.00",
            "HBsAb - Hepatitis B Surface Antibody|Infectious Disease|>10 mIU/mL immune|80.00",
            "HBcAb - Hepatitis B Core Antibody|Infectious Disease|Negative|80.00",
            "HBeAg - Hepatitis B e Antigen|Infectious Disease|Negative|100.00",
            "HCV Ab - Hepatitis C Antibody|Infectious Disease|Negative|80.00",
            "HIV 1/2 Ag/Ab Combo (4th Gen)|Infectious Disease|Non-reactive|100.00",
            "RPR/VDRL (Syphilis Screen)|Infectious Disease|Non-reactive|60.00",
            "FTA-ABS (Syphilis Confirmatory)|Infectious Disease|Non-reactive|100.00",
            "Rubella IgG|Infectious Disease|>10 IU/mL immune|80.00",
            "Rubella IgM|Infectious Disease|Negative|80.00",
            "CMV IgG|Infectious Disease|See interpretation|80.00",
            "CMV IgM|Infectious Disease|Negative|80.00",
            "Toxoplasma IgG|Infectious Disease|See interpretation|80.00",
            "Toxoplasma IgM|Infectious Disease|Negative|80.00",
            "EBV Panel (VCA IgG, IgM, EBNA)|Infectious Disease|See interpretation|200.00",
            "Brucella Agglutination Test|Infectious Disease|<1:80|80.00",
            "Widal Test (Typhoid)|Infectious Disease|<1:80|60.00",
            "Dengue NS1 Antigen|Infectious Disease|Negative|120.00",
            "Dengue IgG/IgM|Infectious Disease|Negative|120.00",
            "Malaria Smear (Thick & Thin)|Infectious Disease|No parasites seen|80.00",
            "Malaria Rapid Test|Infectious Disease|Negative|80.00",
            "Mono Spot Test (Heterophile Ab)|Infectious Disease|Negative|60.00",
            "Varicella-Zoster IgG|Infectious Disease|See interpretation|80.00",
            "Measles IgG|Infectious Disease|See interpretation|80.00",
            "Mumps IgG|Infectious Disease|See interpretation|80.00",

            // ── AUTOIMMUNE MARKERS ──
            "Anti-Tissue Transglutaminase (tTG) IgA|Autoimmune|<20 U/mL|150.00",
            "Anti-Endomysial Antibodies (EMA)|Autoimmune|Negative|200.00",
            "Anti-Gliadin Antibodies (IgA/IgG)|Autoimmune|<20 U/mL|150.00",
            "Anti-GBM Antibodies|Autoimmune|<20 U/mL|200.00",
            "Anti-Smooth Muscle Antibodies (ASMA)|Autoimmune|<1:40|150.00",
            "Anti-Mitochondrial Antibodies (AMA)|Autoimmune|Negative|150.00",
            "Anti-LKM1 Antibodies|Autoimmune|Negative|200.00",
            "Anti-Saccharomyces cerevisiae Ab (ASCA)|Autoimmune|Negative|200.00",
            "HLA-B27|Autoimmune|Negative/Positive|200.00",
            "Anti-Jo-1 Antibodies|Autoimmune|Negative|150.00",
            "Anti-Scl-70 Antibodies|Autoimmune|Negative|150.00",
            "Anti-Centromere Antibodies|Autoimmune|Negative|150.00",

            // ── ARTERIAL BLOOD GAS ──
            "ABG - Arterial Blood Gas|Blood Gas|See components|100.00",
            "pH, Arterial|Blood Gas|7.35-7.45|50.00",
            "pCO2, Arterial|Blood Gas|35-45 mmHg|50.00",
            "pO2, Arterial|Blood Gas|80-100 mmHg|50.00",
            "HCO3 (Bicarbonate), Arterial|Blood Gas|22-26 mEq/L|50.00",
            "Base Excess|Blood Gas|-2 to +2 mEq/L|40.00",
            "O2 Saturation, Arterial|Blood Gas|95-100%|40.00",
            "VBG - Venous Blood Gas|Blood Gas|See components|80.00",
            "Carboxyhemoglobin|Blood Gas|<3% non-smoker|100.00",
            "Methemoglobin|Blood Gas|<1.5%|100.00"};

        for (const QString &lt : labTests) {
          QStringList parts = lt.split("|");
          if (parts.size() == 4) {
            QString testName = parts[0].trimmed().replace("'", "''");
            QString category = parts[1].trimmed().replace("'", "''");
            QString normalRange = parts[2].trimmed().replace("'", "''");
            float price = parts[3].trimmed().toFloat();
            exec(QString("INSERT INTO lab_tests_catalog (test_name, category, "
                         "normal_range, price) VALUES (N'%1', N'%2', N'%3', %4)")
                     .arg(testName, category, normalRange)
                     .arg(price));
          }
        }
      }
    }

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
      // Inject Nahdi Online Real-World Scraped English Drugs
      // First, purge the previously inserted Arabic drugs to meet user request
      exec("DELETE FROM drugs WHERE category = N'مسكنات الألم والحمى'");

      QStringList nahdiEnglishDrugs = {
          // Pain Killers
          "Panadol Extra Tablet 24 pcs|Pain Relief|8.00",
          "Panadol Night 20 Caplets|Pain Relief|11.60",
          "Panadol Advance 24 Tablets|Pain Relief|6.05",
          "Solpadeine Soluble Tablet 20pcs|Pain Relief|13.15",
          "Panadol Actifast 20 Tablets|Pain Relief|9.15",
          "Adol Paracetamol 500 mg – 24 Caplets|Pain Relief|5.05",
          "Salonpas Patches small 20 Pcs|Pain Relief|13.00",
          "Catafast 50 mg Sachet 9pcs|Pain Relief|18.00",
          "Solpadeine Capsule 20pcs|Pain Relief|13.15",
          "Brufen 400 mg Tablet 30 pcs|Pain Relief|13.60",
          "Fevadol-Extra Tablet 20pcs|Pain Relief|5.80",
          "Voltaren Emulgel 1% 100 gm|Pain Relief|26.00",
          "Fevadol-Plus Tablet 20pcs|Pain Relief|9.65",
          "Panadol Extend 24 Tablets|Pain Relief|15.75",
          "Rapidus 50 mg Tablet 20pcs|Pain Relief|29.10",
          "Adol-Extra Caplet 24pcs|Pain Relief|6.40",
          "Ponstan-Forte 500 mg Tablet 20 pcs|Pain Relief|15.30",
          "Panadol Night Tabs 24S|Pain Relief|30.43",
          "Fevadol 500mg 30 Tablet|Pain Relief|6.30",
          "Brufen 600 mg Tablet 30pcs|Pain Relief|19.55",
          "Rofenac-D 50 mg Dispersable Tablet 20pcs|Pain Relief|29.55",
          "Divido Combo 75mg/20mg Caps|Pain Relief|101.10",
          "Panadol 24 Tablets|Pain Relief|5.80",
          "Procto Glyvenol Cream 30 gm|Pain Relief|35.45",
          "Salonpas Patches Large 2 Pcs|Pain Relief|11.00",
          "Voltaren 100mg Suppository 5pcs|Pain Relief|18.20",
          "Divido 75 mg Capsule 20pcs|Pain Relief|30.65",
          "Fast Flam 50 mg Tablet 20 pcs|Pain Relief|26.95",
          "Salonpas Pain Relieving Hot Patch|Pain Relief|32.26",
          "Rofenac 50 mg Tablet 20pcs|Pain Relief|19.80",
          "Roxonin 60 mg Tablet 20pcs|Pain Relief|30.40",
          "Reparil 20 mg Tablet 40pcs|Pain Relief|20.60",
          "Panadrex Paracetamol 500 mg – 48 Tablets|Pain Relief|9.40",
          "Advil Liquid Caps 200Mg 32S|Pain Relief|27.38",
          "Voltaren-Retard 100 mg Tablet 10pcs|Pain Relief|27.30",
          "Disprin 81 mg Tablet 100pcs|Pain Relief|25.00",
          "Emifenac 50 mg Tablet 20pcs|Pain Relief|23.35",
          "Voltaren 50 mg Suppository 10pcs|Pain Relief|19.90",
          "Sapofen 600 mg Tablet 30pcs|Pain Relief|17.40",
          "Sapofen 400 Mg Tablet 30 Pcs|Pain Relief|13.60",
          "Nahdi Feel Flex Cream 100 Ml|Pain Relief|45.75",
          "Relaxon Capsule 30pcs|Pain Relief|27.75",
          "Arnican Gel 100g|Pain Relief|109.25",
          "Krauterhof Sport Gel Hot 150ml|Pain Relief|99.19",
          "Celadrin Joint Care Cream 100ml|Pain Relief|109.25",

          // Cough, Cold & Flu
          "Panadol Cold & Flu Night Time 24 Caplets|Cough & Cold|12.30",
          "Panadol Cold & Flu Sinus 24 Caplets|Cough & Cold|13.60",
          "Prof Cold & Flu Caplet 20 P|Cough & Cold|12.45",
          "Flutab Tablet 30 Pcs|Cough & Cold|14.85",
          "Fludrex Tablet 24pcs|Cough & Cold|12.30",
          "Flutab-Sinus Tablet 20 P|Cough & Cold|9.25",
          "Panadol Cold & Flu All In One 24S|Cough & Cold|26.77",

          // Digestive Care
          "Beatswell Probiotic - 60 Capsules|Digestive Care|29.25",
          "Bio Gaia, Protectis Baby Drops, 5 Ml|Digestive Care|63.74",
          "Probulin Total Care Probiotic 20 Billion 30 Capsules|Digestive "
          "Care|108.74",
          "Dr. Formulated Probiotics Mood + 50 Billion 60 Capsules|Digestive "
          "Care|166.57",
          "Ezora 40 mg esomeprazole Capsules × 28|Digestive Care|65.65",

          // Multivitamins
          "Beatswell Multivitamins (50+) - 30 Capsules|Vitamins & "
          "Supplements|24.75",
          "Beatswell Multivitamin For Adults - 60 Gummies|Vitamins & "
          "Supplements|48.88",
          "Beatswell Kids Multivitamins 60 Strawberry Gummies|Vitamins & "
          "Supplements|37.38",
          "Beatswell Multivitamin Energy - 20 Effervescent Tablets|Vitamins & "
          "Supplements|24.90",
          "Sanotact Multivitamin 20 Orange Effervescent Tablets|Vitamins & "
          "Supplements|24.90",
          "Wellbeing Nutrition melts - Multivitamins - 30 Oral Strip|Vitamins "
          "& Supplements|20.00",
          "Solaray Active Man Multivitamin 1 Daily 90 Capsules|Vitamins & "
          "Supplements|56.96",
          "H&B Multivitamin - 30 Gummies|Vitamins & Supplements|86.00"};
      for (const QString &nd : nahdiEnglishDrugs) {
        QStringList parts = nd.split("|");
        if (parts.size() == 3) {
          QString nameStr = QString(parts[0]).replace("'", "''");
          QSqlQuery check = exec(
              QString("SELECT id FROM drugs WHERE name=N'%1'").arg(nameStr));
          if (!check.next()) {
            exec(QString("INSERT INTO drugs (name, category, price) VALUES "
                         "(N'%1', N'%2', %3)")
                     .arg(nameStr)
                     .arg(QString(parts[1]).replace("'", "''"))
                     .arg(parts[2].toFloat()));
          }
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
