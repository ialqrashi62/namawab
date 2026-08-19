'use strict';
const Card = require('./tier136_card_692_engine.js');
const Str = require('./tier136_str_693_engine.js');
const Bur = require('./tier136_bur_694_engine.js');
const Tox = require('./tier136_tox_695_engine.js');
const tests = [
  { e: 'card', f: 'cath_lab', b: { tenant_id: 't1', patient_id: 'P1', procedure: 'PCI', access: 'radial', contrast_ml: 120, fluoro_dose_gy: 1.5, door_to_balloon_min: 45, provider: 'card_001' } },
  { e: 'card', f: 'stress_test', b: { tenant_id: 't1', patient_id: 'P2', type: 'exercise', max_hr: 165, hr_recovery: 30, st_changes: false, result: 'negative', provider: 'card_001' } },
  { e: 'card', f: 'echo_study', b: { tenant_id: 't1', patient_id: 'P3', type: 'TTE', lvef: 55, lvidd: 50, tapse: 22, valve_disease: 'MR', provider: 'card_001' } },
  { e: 'card', f: 'device_check', b: { tenant_id: 't1', patient_id: 'P4', device_type: 'ICD', battery_pct: 75, leads_impedance: 500, shocks_delivered: false, provider: 'card_001', episode_summary: 'no_arrhythmias' } },
  { e: 'card', f: 'ablation_ep', b: { tenant_id: 't1', patient_id: 'P5', target: 'AF', energy: 'pulsed_field', procedure_duration_min: 120, acute_success: true, provider: 'card_001' } },
  { e: 'str', f: 'stroke_alert', b: { tenant_id: 't1', patient_id: 'P6', last_known_well_min: 60, nihss: 14, aspires: 8, lvo_suspected: true, door_to_ct_min: 25, door_to_needle_min: 45, provider: 'str_001' } },
  { e: 'str', f: 'tpa_admin', b: { tenant_id: 't1', patient_id: 'P6', stroke_id: 'SK1', dose_mg: 72, weight_kg: 80, outcome: 'administered', provider: 'str_001', bleeding_complication: false } },
  { e: 'str', f: 'thrombectomy_proc', b: { tenant_id: 't1', patient_id: 'P7', stroke_id: 'SK2', door_to_puncture_min: 90, tici_reperfusion: 3, technique: 'stent_retriever', provider: 'str_001', post_mrs: true } },
  { e: 'str', f: 'icp_monitor', b: { tenant_id: 't1', patient_id: 'P8', method: 'EVD', icp_mmhg: 18, cpp_mmhg: 65, treatment_initiated: true, provider: 'str_001', tier: 'severe' } },
  { e: 'str', f: 'recovery_milestone', b: { tenant_id: 't1', patient_id: 'P9', day_post_stroke: 7, disposition: 'rehab', mrs: 3, barthel: 65, dysphagia_screened: true, provider: 'str_001' } },
  { e: 'bur', f: 'burn_assess', b: { tenant_id: 't1', patient_id: 'P10', tbsa_pct: 35, depth: '2nd_deep', mechanism: 'thermal', inhalation_injury: true, provider: 'bur_001' } },
  { e: 'bur', f: 'fluid_resus', b: { tenant_id: 't1', patient_id: 'P10', burn_id: 'BR1', weight_kg: 80, tbsa_pct: 35, formula: 'Parkland', rate_ml_hr: 583, urine_output_ml_hr: 65, provider: 'bur_001' } },
  { e: 'bur', f: 'wound_care', b: { tenant_id: 't1', patient_id: 'P11', burn_id: 'BR2', dressing: 'silver_sulfadiazine', excision: 'tangential', grafting: true, provider: 'bur_001', site: 'abdomen' } },
  { e: 'bur', f: 'inhalation', b: { tenant_id: 't1', patient_id: 'P12', burn_id: 'BR3', intubated: true, cxr_grade: 2, co_poisoning: true, cohb_pct: 22, provider: 'bur_001', hyperbaric: 'recommended' } },
  { e: 'bur', f: 'rehab', b: { tenant_id: 't1', patient_id: 'P13', day_post_burn: 30, range_motion_pct: 75, contracture_risk: 30, graft_healed: true, provider: 'bur_001', pressure_garment: 'custom' } },
  { e: 'tox', f: 'tox_screen', b: { tenant_id: 't1', patient_id: 'P14', specimen: 'urine', substances_tested: '10_panel', detected_count: 2, substances_detected: 'opioid,cannabis', provider: 'tox_001', method: 'GC_MS' } },
  { e: 'tox', f: 'poisoning', b: { tenant_id: 't1', patient_id: 'P15', toxin: 'acetaminophen', ingestion_time_min: 120, dose_amount: 12, intent: 'suicide_attempt', severity: 'severe', provider: 'tox_001' } },
  { e: 'tox', f: 'antidote', b: { tenant_id: 't1', patient_id: 'P15', pois_id: 'PO1', antidote: 'NAC', dose_mg: 15000, effective: true, provider: 'tox_001' } },
  { e: 'tox', f: 'decon', b: { tenant_id: 't1', patient_id: 'P16', pois_id: 'PO2', method: 'activated_charcoal', start_min: 30, contraindicated: false, provider: 'tox_001' } },
  { e: 'tox', f: 'tox_follow', b: { tenant_id: 't1', patient_id: 'P17', pois_id: 'PO3', hour_post: 8, lab_value: 50, trend: 'improving', provider: 'tox_001', complications: false } }
];
const engines = { card: Card.funcs(), str: Str.funcs(), bur: Bur.funcs(), tox: Tox.funcs() };
let pass = 0, fail = 0;
for (const t of tests) {
  try { const r = engines[t.e][t.f](t.b); if (r && typeof r === 'object') { console.log('PASS ' + t.e + '.' + t.f); pass++; } else { console.log('FAIL ' + t.e + '.' + t.f, r); fail++; } }
  catch (e) { console.log('FAIL ' + t.e + '.' + t.f + ' - ' + e.message); fail++; }
}
console.log('Engine self-test: PASS=' + pass + ' FAIL=' + fail);
process.exit(fail > 0 ? 1 : 0);
