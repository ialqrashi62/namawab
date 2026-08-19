'use strict';
const Neon = require('./tier144_neon_685_engine.js');
const Psy = require('./tier144_psy_686_engine.js');
const Ger = require('./tier144_ger_687_engine.js');
const All = require('./tier144_all_688_engine.js');
const tests = [
  { e: 'neon', f: 'apgar', b: { tenant_id: 't1', patient_id: 'P1', appearance: 2, pulse: 2, grimace: 2, activity: 2, respiration: 2, apgar_1: 10, apgar_5: 10, apgar_10: 10, provider: 'NN_001' } },
  { e: 'neon', f: 'bilimeter', b: { tenant_id: 't1', patient_id: 'P2', age_hours: 48, bili_total: 12.5, bili_direct: 0.5, bili_indirect: 12.0, phototherapy: 'conventional', threshold_above: 2, bili_alert: true, provider: 'NN_001' } },
  { e: 'neon', f: 'feeding', b: { tenant_id: 't1', patient_id: 'P3', feed_type: 'mixed', volume_ml: 30, feeds_per_day: 8, weight_gain_g_day: 25, calories_kcal_kg: 120, route: 'OG', provider: 'NN_001' } },
  { e: 'neon', f: 'kangaroo', b: { tenant_id: 't1', patient_id: 'P4', caregiver_id: 'C1', session_duration_min: 90, sessions_per_day: 4, skin_to_skin: 80, breastfeeding_count: 8, incubator_needed: false, temperature_stability: 8, provider: 'NN_001' } },
  { e: 'neon', f: 'screening', b: { tenant_id: 't1', patient_id: 'P5', test_type: 'newborn_hearing', result: 'normal', day_of_life: 2, referral_count: 0, provider: 'NN_001' } },
  { e: 'psy', f: 'ect', b: { tenant_id: 't1', patient_id: 'P6', type: 'bilateral', session_number: 5, energy_mc: 250, seizure_duration_sec: 30, pretreatment_egg: 160, pretreatment_mabp: 95, medication: 'methohexital', provider: 'PY_001' } },
  { e: 'psy', f: 'tms', b: { tenant_id: 't1', patient_id: 'P7', protocol: 'high_frequency_left', intensity_pct: 120, frequency_hz: 10, session_duration_min: 30, session_number: 15, indication: 'MDD', provider: 'PY_001' } },
  { e: 'psy', f: 'ketamine', b: { tenant_id: 't1', patient_id: 'P8', dose_mg_kg: 0.5, route: 'IV', session_duration_min: 45, indication: 'TRD', dissociative: true, provider: 'PY_001' } },
  { e: 'psy', f: 'monitoring', b: { tenant_id: 't1', patient_id: 'P9', phq9_score: 8, gad7_score: 6, ymrs_score: 2, bprs_score: 35, aims_score: 0, cgi_severity: 3, adherence: 'good', provider: 'PY_001' } },
  { e: 'psy', f: 'community', b: { tenant_id: 't1', patient_id: 'P10', program: 'ACT_team', visits_per_week: 5, duration_months: 12, outcome_score: 75, hospitalization: false, days_hospitalized: 0, provider: 'PY_001' } },
  { e: 'ger', f: 'cga', b: { tenant_id: 't1', patient_id: 'P11', age: 78, adl_score: 5, iadl_score: 6, mmse_score: 24, moca_score: 22, gds_score: 3, mna_score: 10, tinetti_score: 22, charlson: 3, provider: 'GR_001' } },
  { e: 'ger', f: 'frailty', b: { tenant_id: 't1', patient_id: 'P12', fried_score: 3, rockwood_stage: 'mildly_frail', efs_score: 4, cfs_stage: '4', grip_kg: 22, gait_speed: 0.8, weight_loss_kg: 5, provider: 'GR_001' } },
  { e: 'ger', f: 'polypharm', b: { tenant_id: 't1', patient_id: 'P13', med_count: 12, beers_count: 3, stopp_count: 4, chads: 'high', ddi_count: 5, anti_cholinergic_burden: 2, renal_dose_adj: true, warfarin_dose: 2, provider: 'GR_001' } },
  { e: 'ger', f: 'geriatric_syn', b: { tenant_id: 't1', patient_id: 'P14', syndrome: 'frailty', severity: 2, intervention: 'PT_OT', response_days: 14, resolved: false, provider: 'GR_001' } },
  { e: 'ger', f: 'goals', b: { tenant_id: 't1', patient_id: 'P15', goal_type: 'POLST', summary: 'DNR_DNI', code_status: 'DNR_DNI', discussion_minutes: 45, provider: 'GR_001', family_present: true } },
  { e: 'all', f: 'skin_test', b: { tenant_id: 't1', patient_id: 'P16', allergen: 'dust_mite', wheal_mm: 8, flare_mm: 25, reaction: 'positive_3', naive_control_mm: 0, histamine_control_mm: 7, provider: 'AL_001' } },
  { e: 'all', f: 'ige', b: { tenant_id: 't1', patient_id: 'P17', total_ige_kiu_l: 250, specific_ige_kiu_l: 18.5, allergen: 'peanut', class: '4_very_high', trend: 2, new_sensitization: true, provider: 'AL_001' } },
  { e: 'all', f: 'immunotherapy', b: { tenant_id: 't1', patient_id: 'P18', type: 'SCIT', vial_strength: 1, dose_ml: 0.5, dose_count: 25, total_visits: 30, local_reaction: 'erythema', systemic_reaction: 'none', provider: 'AL_001' } },
  { e: 'all', f: 'anaphylaxis', b: { tenant_id: 't1', patient_id: 'P19', trigger: 'food', severity: 'severe', epinephrine_doses: 2, biphasic_reaction: 8, icu_admission: true, management: 'epi_im_iv_steroids_antihist', provider: 'ER_001' } },
  { e: 'all', f: 'biologic', b: { tenant_id: 't1', patient_id: 'P20', medication: 'omalizumab', dose_mg: 300, route: 'SC', frequency_weeks: 4, response: 'excellent', serum_ige: 250, eosinophil_count: 350, provider: 'AL_001' } }
];
const engines = { neon: Neon.funcs(), psy: Psy.funcs(), ger: Ger.funcs(), all: All.funcs() };
let pass = 0, fail = 0;
for (const t of tests) {
  try { const r = engines[t.e][t.f](t.b); if (r && typeof r === 'object') { console.log('PASS ' + t.e + '.' + t.f); pass++; } else { console.log('FAIL ' + t.e + '.' + t.f, r); fail++; } }
  catch (e) { console.log('FAIL ' + t.e + '.' + t.f + ' - ' + e.message); fail++; }
}
console.log('Engine self-test: PASS=' + pass + ' FAIL=' + fail);
process.exit(fail > 0 ? 1 : 0);
