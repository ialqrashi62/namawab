'use strict';
const Ob = require('./tier143_ob_681_engine.js');
const Ent = require('./tier143_ent_682_engine.js');
const Uro = require('./tier143_uro_683_engine.js');
const Dent = require('./tier143_dent_684_engine.js');
const tests = [
  { e: 'ob', f: 'pregnancy_register', b: { tenant_id: 't1', patient_id: 'P1', lmp: 20260401, ega_weeks: 12, gravida: 2, para: 1, miscarriages: 0, risk: 'low', bmi: 24.5, booking_provider: 'DR_001' } },
  { e: 'ob', f: 'antenatal_visit', b: { tenant_id: 't1', patient_id: 'P1', pregnancy_id: 'PG1', ega_weeks: 24, weight_kg: 68, bp_systolic: 120, bp_diastolic: 80, fetal_heart_rate: 145, fundal_height: '24cm', symptoms_score: 2, provider: 'MW_001' } },
  { e: 'ob', f: 'ultrasound', b: { tenant_id: 't1', patient_id: 'P1', pregnancy_id: 'PG1', type: 'anomaly', ega_weeks: 20, fetal_weight_g: 350, afi: 14, placenta: 'anterior', cervical_length: 35, provider: 'US_001' } },
  { e: 'ob', f: 'delivery', b: { tenant_id: 't1', patient_id: 'P1', pregnancy_id: 'PG1', mode: 'vaginal', labor_hours: 8, perineal: 'intact', ebl_ml: 250, apgar_1: 8, apgar_5: 9, birth_weight_g: 3200, provider: 'MW_001' } },
  { e: 'ob', f: 'postpartum', b: { tenant_id: 't1', patient_id: 'P1', delivery_id: 'DE1', days_post_delivery: 7, bp_systolic: 118, bp_diastolic: 78, lochia: 2, involution: 8, mood: 'normal', bonding_score: 9, provider: 'MW_001' } },
  { e: 'ent', f: 'audiogram', b: { tenant_id: 't1', patient_id: 'P2', db_500: 25, db_1000: 30, db_2000: 40, db_4000: 50, db_8000: 60, type: 'air', loss_grade: 'mild', provider: 'ENT_001' } },
  { e: 'ent', f: 'endoscopy', b: { tenant_id: 't1', patient_id: 'P3', type: 'nasopharyngoscopy', findings: 'normal_post_nasal_space', biopsy_count: 0, pathology: false, complications: 'none', provider: 'ENT_001' } },
  { e: 'ent', f: 'tinnitus', b: { tenant_id: 't1', patient_id: 'P4', type: 'subjective', thi_score: 48, severity: 'moderate', laterality: 'bilateral', pitch: 'high_pitched', provider: 'ENT_001' } },
  { e: 'ent', f: 'sinus_ct', b: { tenant_id: 't1', patient_id: 'P5', lund_mackay: '7-12', lund_mackay_score: 8, snout_pneumatization: 1, findings: 'bilateral_mild_mucosal_thickening', provider: 'ENT_001' } },
  { e: 'ent', f: 'voice', b: { tenant_id: 't1', patient_id: 'P6', vhi_score: 35, grade: '2', hoarseness: 'moderate', max_phonation_time: 12, f0_hz: 180, stroboscopy: true, provider: 'ENT_001' } },
  { e: 'uro', f: 'psa', b: { tenant_id: 't1', patient_id: 'P7', psa_ng_ml: 4.5, psa_age_adj: 3.0, psa_velocity: 0.3, psa_density: 0.15, zone: 'transition', prostate_volume: 35, provider: 'UR_001' } },
  { e: 'uro', f: 'uroflow', b: { tenant_id: 't1', patient_id: 'P8', q_max: 8, q_avg: 5, voided_volume: 250, residual_volume: 50, flow_time: 30, pattern: 'obstructive', provider: 'UR_001' } },
  { e: 'uro', f: 'biopsy', b: { tenant_id: 't1', patient_id: 'P9', approach: 'transrectal', cores: 12, positive_cores: 3, gleason: '7_intermediate', stage: 'T2a', provider: 'UR_001' } },
  { e: 'uro', f: 'stone', b: { tenant_id: 't1', patient_id: 'P10', stone_id: 'ST1', size_mm: 12, location: 'left_renal_pelvis', type: 'calcium_oxalate', hounsfield: 800, management: 'ESWL', provider: 'UR_001' } },
  { e: 'uro', f: 'urinary', b: { tenant_id: 't1', patient_id: 'P11', type: 'incontinence', episodes_per_day: 4, pad_count: 3, ipss_score: 18, severity: 'moderate', provider: 'UR_001' } },
  { e: 'dent', f: 'tooth_chart', b: { tenant_id: 't1', patient_id: 'P12', tooth_id: 'T1', tooth_number: 14, condition: 'caries', surface: 'occlusal', depth: 4, symptomatic: true, provider: 'DT_001' } },
  { e: 'dent', f: 'period', b: { tenant_id: 't1', patient_id: 'P13', pocket_4mm: 12, pocket_5mm: 8, pocket_6mm: 4, pocket_7mm_plus: 2, bleeding_pct: 25, plaque_pct: 35, recession: 2, stage: '2', grade: 'B', provider: 'DT_001' } },
  { e: 'dent', f: 'caries', b: { tenant_id: 't1', patient_id: 'P14', tooth_id: 'T2', severity: 'moderate', surface_loc: 'proximal', symptomatic: false, treatment: 'composite_filling', provider: 'DT_001' } },
  { e: 'dent', f: 'ortho', b: { tenant_id: 't1', patient_id: 'P15', malocclusion: 'class_II_div_1', treatment_months: 18, appliance: 'invisalign', elastic: true, progress_pct: 60, provider: 'DT_001' } },
  { e: 'dent', f: 'implant', b: { tenant_id: 't1', patient_id: 'P16', position: 36, system: 'Straumann', diameter_mm: 4.5, length_mm: 12, stage: 'osseointegration', bone_density: 900, provider: 'DT_001' } }
];
const engines = { ob: Ob.funcs(), ent: Ent.funcs(), uro: Uro.funcs(), dent: Dent.funcs() };
let pass = 0, fail = 0;
for (const t of tests) {
  try { const r = engines[t.e][t.f](t.b); if (r && typeof r === 'object') { console.log('PASS ' + t.e + '.' + t.f); pass++; } else { console.log('FAIL ' + t.e + '.' + t.f, r); fail++; } }
  catch (e) { console.log('FAIL ' + t.e + '.' + t.f + ' - ' + e.message); fail++; }
}
console.log('Engine self-test: PASS=' + pass + ' FAIL=' + fail);
process.exit(fail > 0 ? 1 : 0);
