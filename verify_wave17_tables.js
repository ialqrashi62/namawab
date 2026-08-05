const { spawnSync } = require('child_process');
const sql = "bash -c '"
  + "for t in fhir_resources hl7_messages finance_vouchers finance_accounts_payable finance_accounts_receivable finance_doctor_commissions hr_employees hr_salaries hr_wps_files hr_gosi_records pharmacy_controlled_substances pharmacy_cs_transactions patient_problem_list patient_referrals nursing_care_plans nursing_assessments pathology_cases oncology_patient_regimens telemedicine_sessions portal_messages online_bookings ai_cds_log ai_voice_sessions ; do "
  + "echo \"=== $t ===\"; "
  + "sudo -u postgres psql -d nama_medical_web -t -c \"SELECT to_regclass('\\''public.$t'\\'') IS NOT NULL AS exists, (SELECT column_name FROM information_schema.columns WHERE table_schema = '\\''public'\\'' AND table_name = '\\''$t'\\'' AND column_name = '\\''tenant_id'\\'') AS tenant_col;\" 2>&1 | grep -v \"could not change directory\"; "
  + "done'";

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  sql
]);
process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 6000));
