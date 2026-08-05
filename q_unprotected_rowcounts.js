const { spawnSync } = require('child_process');

const tables = [
  "cardiology_cath_reports","clinical_incidents","cosmetic_cases","cosmetic_consents",
  "cosmetic_followups","cosmetic_photos","dental_images","dental_periodontal_exams",
  "doctor_inventory_request_items","doctor_inventory_requests","emar_administrations",
  "emar_orders","employee_exposures","finance_report_snapshots","finance_tax_declarations",
  "hand_hygiene_audits","hr_advances","hr_attendance","hr_credentialing",
  "hr_employee_custody","hr_employee_documents","hr_leaves","hr_nitaqat_records",
  "icu_daily_goals","incident_reports","infection_outbreaks","infection_surveillance",
  "inventory","inventory_dept_request_items","inventory_dept_requests",
  "inventory_issue_items","inventory_issue_to_dept","inventory_opening_balances",
  "inventory_purchase_items","inventory_purchases","inventory_stock_count",
  "lab_loinc_codes","lab_microbiology","maintenance_equipment","maintenance_pm_schedules",
  "maintenance_work_orders","medical_certificates","medication_reconciliations",
  "mortuary_cases","nphies_claim_status_inquiry","nphies_remittance_advice",
  "pediatric_immunizations","pharmacy_opening_balances","pharmacy_purchase_items",
  "pharmacy_purchase_orders","pharmacy_suppliers","quality_incidents","quality_kpis",
  "quality_patient_satisfaction","queue_advertisements","social_work_cases",
  "tenant_settings","transport_requests","vendors","zatca_credit_notes"
];
console.log("total tables:", tables.length);

// Build a single UNION ALL of dynamic count(*) with to_regclass() so we don't fail on missing
const sql = `
SELECT t.name AS table_name, COALESCE(c.n_live_tup, 0) AS approx_rows
FROM (
  ${tables.map((tn,i)=>`SELECT ${i} AS id, '${tn}' AS name`).join('\n  UNION ALL ')}
) t
LEFT JOIN pg_stat_user_tables c ON c.relname = t.name
ORDER BY t.name;
`;

const psqlScript = `sudo -u postgres psql -d nama_medical_web -t <<'SQL' 2>&1 | grep -v "could not change directory"
${sql}
SQL
`;

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -s`
], { input: psqlScript, encoding: 'utf8' });

console.log("=== row counts (pg_stat_user_tables.n_live_tup) for all 60 unprotected tables ===");
console.log((r.stdout || r.stderr || '').toString().slice(0, 10000));
