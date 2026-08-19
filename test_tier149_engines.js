// filepath: test_tier149_engines.js
const modules = [
  { mod: 'tier149_car_705', fns: ['echo','stress_test','cath','device','heart_failure'] },
  { mod: 'tier149_pul_706', fns: ['pft','sleep','copd','asthma','bronchoscopy'] },
  { mod: 'tier149_gi_707', fns: ['endoscopy','liver','ibd','gerd','biliary'] },
  { mod: 'tier149_nep_708', fns: ['ckd_progression','dialysis_access','transplant_eval','renal_replacement','acid_base'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier149_car_705') {
    if (fn === 'echo') return { ...base, lvef_pct: 55, lv_function: 'normal', lvidd_mm: 50, lvids_mm: 35, tapse_mm: 22, valve_abnormalities: 'none', ef_pasp: 30, trv: 2.5 };
    if (fn === 'stress_test') return { ...base, type: 'treadmill', duration_min: 12, mets: 12, max_hr: 170, pct_max_hr: 100, result: 'negative', st_depression_mm: 0, chest_pain: false };
    if (fn === 'cath') return { ...base, access: 'radial', contrast_ml: 80, fluoro_min: 15, dose_mgy: 50, lad_stenosis_pct: 70, lcx_stenosis_pct: 30, rca_stenosis_pct: 40, lm_stenosis_pct: 10, ef_pct: 55, lvedp_mmhg: 12, pci_performed: true };
    if (fn === 'device') return { ...base, device: 'pacemaker_dual', manufacturer: 'Medtronic', battery_voltage: 2.8, battery_eri: 2.5, lead_impedance_ohms: 500, threshold_v: 1.0, shock_delivered: false, last_followup_days: 90 };
    if (fn === 'heart_failure') return { ...base, nyha: 'II', acc_aha_stage: 'C_symptomatic', lvef_pct: 35, bnp: 500, ntprobnp: 1200, weight_kg: 80, daily_weight_kg: 80, fluid_intake_ml: 1500, medications: 'GDMT_quad' };
  }
  if (modName === 'tier149_pul_706') {
    if (fn === 'pft') return { ...base, fvc_l: 4, fev1_l: 3.2, fev1_fvc_pct: 80, pef_l_min: 400, tlc_l: 6, rv_l: 1.5, dlco: 80, pattern: 'normal', bronchodilator_response_pct: 5 };
    if (fn === 'sleep') return { ...base, type: 'home_sleep_test', ahi: 15, odi: 12, tst_min: 420, sleep_efficiency_pct: 85, min_sao2: 85, severity: 'moderate', position: 'supine_predominant' };
    if (fn === 'copd') return { ...base, gold_stage: 'II_moderate', gold_group: 'B_high_symp_low_risk', exacerbations_per_year: 1, mmrc: 2, cat_score: 15, sao2: 92, pao2: 70, paco2: 40, fev1_pct_predicted: 60 };
    if (fn === 'asthma') return { ...base, control: 'partly_controlled', act_score: 18, fev1_pct_pred: 80, feNO: 30, exacerbations_per_year: 2, ics_dose: 500, biomarker: 'eosinophilic', blood_eos: 300 };
    if (fn === 'bronchoscopy') return { ...base, procedure: 'BAL', duration_min: 30, ebl: false, findings: 'normal', biopsy_count: 0, bal_volume_ml: 100, complications: false };
  }
  if (modName === 'tier149_gi_707') {
    if (fn === 'endoscopy') return { ...base, type: 'colonoscopy_screening', indication_count: 1, duration_min: 30, depth_insertion_cm: 100, findings: 'diverticula', num_polyps: 2, num_biopsies: 4, asa_score: 'II', complications: false };
    if (fn === 'liver') return { ...base, alb: 3.5, bili: 1.5, inr: 1.2, creatinine: 1.0, child_pugh: 'A', meld_na: 12, meld_original: 10, albi_grade: 1, fibroscan_kpa: 8, cap_score: 'S1', etiology: 'NAFLD' };
    if (fn === 'ibd') return { ...base, type: 'Crohns', location: 'ileal', mayo_score: 4, crai_score: 5, sccai: 6, fecal_calprotectin: 200, behavior: 'B1_inflammatory', montreal_age: 'A2' };
    if (fn === 'gerd') return { ...base, endoscopy_findings: 'LA_grade_A', deMeester_score: 25, pH_less_4_pct: 8, biased_reflux: false, symptom_correlation: true, les_length_cm: 3, ingers: 'false', h_pylori: false };
    if (fn === 'biliary') return { ...base, procedure: 'ERCP_therapeutic', bili: 2.5, alp: 150, ggt: 200, duration_min: 45, findings: 'stones', sphincterotomy_done: true, stent_placed: false };
  }
  if (modName === 'tier149_nep_708') {
    if (fn === 'ckd_progression') return { ...base, egfr_baseline: 60, egfr_current: 45, slope: -3, alb_creat_ratio: 100, progression_risk: 'moderate', rapid_decline: false, kfre_2yr_pct: 5, kfre_5yr_pct: 15 };
    if (fn === 'dialysis_access') return { ...base, access_type: 'AVF', access_age_months: 12, flow_rate_ml_min: 800, thrill: true, bruit: true, vein_diameter_mm: 6, artery_diameter_mm: 4, maturation: 'mature' };
    if (fn === 'transplant_eval') return { ...base, evaluation_status: 'listed', waitlist_days: 365, cpra_pct: 30, desensitization: false, cold_ischemia_hr: 12, donor_age: 45, ECD: false, kdpi_pct: 35 };
    if (fn === 'renal_replacement') return { ...base, modality: 'in_center_HD', bun_pre: 60, bun_post: 20, urr_pct: 67, kt_v: 1.4, ultrafiltration_ml: 2500, duration_hr: 4, sessions_per_week: 3, access_pressure: 100 };
    if (fn === 'acid_base') return { ...base, ph: 7.35, pco2: 40, hco3: 22, base_excess: -2, lactate: 1.5, anion_gap: 12, delta_gap: 4, disorder: 'normal' };
  }
  return base;
}
let pass = 0, fail = 0;
for (const { mod, fns } of modules) {
  const m = require(`./${mod}_engine.js`);
  const F = m.funcs();
  for (const fn of fns) {
    try {
      F[fn](makeBody(mod, fn));
      console.log(`OK ${mod}.${fn}`);
      pass++;
    } catch (e) {
      console.error(`FAIL ${mod}.${fn}: ${e.message}`);
      fail++;
    }
  }
}
console.log(`TOTALS: pass=${pass} fail=${fail}`);
process.exit(fail > 0 ? 1 : 0);