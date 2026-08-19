'use strict';
/**
 * BCMA Seeder — test data for development
 * Run: node seeder.js (with NODE_ENV=development)
 */
const db = require('./db_postgres');

const HIGH_ALERT_DRUGS = ['insulin', 'heparin', 'warfarin', 'chemo_paclitaxel', 'chemo_doxorubicin', 'potassium_chloride', 'neuromuscular_blocker'];

const SAMPLE_PATIENTS = [
  { mrn: 'MRN-001', name: 'أحمد محمد', allergies: [] },
  { mrn: 'MRN-002', name: 'فاطمة علي', allergies: ['penicillin'] },
  { mrn: 'MRN-003', name: 'محمد عبدالله', allergies: ['sulfa', 'latex'] },
];

const SAMPLE_ORDERS = [
  { patient_mrn: 'MRN-001', drug: 'Amoxicillin', dose: '500mg', route: 'PO', freq: 'q8h' },
  { patient_mrn: 'MRN-002', drug: 'Penicillin V', dose: '500mg', route: 'PO', freq: 'q6h' },
  { patient_mrn: 'MRN-003', drug: 'Insulin Regular', dose: '10U', route: 'SC', freq: 'AC' },
];

async function seed() {
  console.log('Seeding BCMA test data...');
  for (const p of SAMPLE_PATIENTS) {
    await db.query(`INSERT INTO patients (mrn, full_name, allergies) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`, [p.mrn, p.name, p.allergies]);
  }
  for (const o of SAMPLE_ORDERS) {
    const drugCode = `DG-${o.drug.toUpperCase().replace(/\s/g, '')}`;
    const isHighAlert = HIGH_ALERT_DRUGS.some(h => o.drug.toLowerCase().includes(h.replace(/_/g, '')));
    await db.query(`INSERT INTO bcma_mar_entries (mar_id, patient_id, drug_id, drug_name, dose, route, scheduled_at, status, high_alert) VALUES ($1, (SELECT id FROM patients WHERE mrn=$2 LIMIT 1), 1, $3, $4, $5, NOW() + INTERVAL '15 minutes', 'pending', $6) ON CONFLICT DO NOTHING`, [`MAR-${Date.now()}-${Math.random()}`, o.patient_mrn, o.drug, o.dose, o.route, isHighAlert]);
  }
  console.log('✓ Seeded', SAMPLE_PATIENTS.length, 'patients +', SAMPLE_ORDERS.length, 'orders');
  process.exit(0);
}

if (require.main === module) seed().catch(e => { console.error(e); process.exit(1); });