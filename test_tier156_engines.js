// filepath: test_tier156_engines.js
const modules = [
  { mod: 'tier156_crs_735', fns: ['colonoscopy','colorectal_ca','resect','pouch','followup_crc'] },
  { mod: 'tier156_hpb_736', fns: ['liver_resection','pancreas','biliary','spleen','hernia'] },
  { mod: 'tier156_txp_737', fns: ['evaluation','donor_proc','recipient_op','immunosuppressant','post_op'] },
  { mod: 'tier156_tra_738', fns: ['trauma_eval','resus','damage_control','complication','outcome_trauma'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier156_crs_735') {
    if (fn === 'colonoscopy') return { ...base, indication: 'screening', bowel_prep: 'excellent', cec_intubation: 1, withdrawal_time_min: 8, num_polyps: 2, num_polyps_resected: 2, num_polyps_cancer: 0, num_biopsies: 0, adenoma_detected: 'yes', findings: 'polyps', complication: 'none' };
    if (fn === 'colorectal_ca') return { ...base, location: 'ascending', tnm_t: 'T3', tnm_n: 'N0', tnm_m: 'M0', mmr_status: 'MMR_proficient', ras_status: 'wild_type', her2_positive: false, sidedness: 'right', lvi: 0, lymph_nodes_examined: 15, lymph_nodes_positive: 0, grade: 'G2' };
    if (fn === 'resect') return { ...base, procedure: 'right_hemicolectomy', ebl_ml: 100, duration_hr: 2, diverting_stoma: false, complication: 'none', los_days: 4, time_to_diet: 2, days_to_discharge: 4, surgeon: 'dr_cs' };
    if (fn === 'pouch') return { ...base, type: 'J_pouch', pouch_length_cm: 15, stoma_output_ml_day: 500, bowel_freq_day: 5, bowel_freq_night: 1, pouchitis: false, oda_score: 3, treatment: 'none', continence_good: true, quality_of_life: 80 };
    if (fn === 'followup_crc') return { ...base, months_post_op: 6, stage: 'IIA', cea_level: 'normal', ct_chest_abdomen: false, colonoscopy_done: true, recurrence: false, dfs_months: 6, os_months: 6, ostomy: false, karnofsky: '90' };
  }
  if (modName === 'tier156_hpb_736') {
    if (fn === 'liver_resection') return { ...base, indication: 'HCC', type: 'right_hepatectomy', tumor_size_cm: 5, tumor_count: 1, segments_resected: 6, cpb_min: 0, pringle_min: 30, ebl_ml: 500, bilirubin_pre: 0.8, liver_remnant_pct: 40, complication: 'none', surgeon: 'dr_hpb' };
    if (fn === 'pancreas') return { ...base, procedure: 'whipple', approach: 'open', ebl_ml: 300, duration_hr: 5, complication: 'none', drain_output_d1_ml: 200, drain_amylase_d1: 1000, drain_amylase_d3: 200, los_days: 8, readmission_30d: false, surgeon: 'dr_hpb' };
    if (fn === 'biliary') return { ...base, procedure: 'laparoscopic_chole', findings: 'cholelithiasis', ebl_ml: 20, conversion_rate: 0, bile_leak: 0, cbds_injury: 0, operative_time_min: 60, los_days: 0, same_day_discharge: true, surgeon: 'dr_hpb' };
    if (fn === 'spleen') return { ...base, indication: 'ITP', type: 'laparoscopic', weight_grams: 250, accessory_spleens: 0, ebl_ml: 50, duration_min: 90, los_days: 2, complication: 'none', vaccines_done: true, surgeon: 'dr_hpb' };
    if (fn === 'hernia') return { ...base, type: 'inguinal_open', size: 'S_small', duration_min: 60, mesh_used: 'polypropylene', ebl_ml: 20, los_hours: 6, recurrence_pct: 5, complication: 'none', surgeon: 'dr_sx' };
  }
  if (modName === 'tier156_txp_737') {
    if (fn === 'evaluation') return { ...base, organ: 'kidney', age: 50, bmi: 25, status: 'listed', egfr: 12, meld: 15, lvef: 60, fev1: 80, bilirubin: 1.0, hba1c: 5.5, comorbidities_clear: true, psychiatric_clear: true, psychosocial_clear: true, financial_clear: true };
    if (fn === 'donor_proc') return { ...base, donor_id: 'd1', type: 'DBD', age: 35, weight_kg: 75, height_cm: 175, creatinine: 1.0, bilirubin: 0.8, ast: 25, alt: 30, lvef: 60, fev1: 80, cause_of_death: 'trauma', cold_ischemia: 12, warm_ischemia: 30, machine_perfusion: true };
    if (fn === 'recipient_op') return { ...base, case_id: 'c1', organ: 'kidney', cit_hr: 12, wit_min: 30, ebl_ml: 200, cpb_min: 0, uf_ml: 0, diuresis_ml: 500, urine_output_ml: 1000, dialysis_required: false, operative_time_hr: 3, reperfusion_quality: true, surgeon: 'dr_tx' };
    if (fn === 'immunosuppressant') return { ...base, drug: 'tacrolimus', dose_mg: 5, drug_level_ng_ml: 8, days_post_tx: 30, trough_level: true, tac_level: 8, adjustment: 'none', toxicity: 'none', lab_stable_days: 30 };
    if (fn === 'post_op') return { ...base, days_post_tx: 14, creatinine: 1.2, egfr: 60, albumin: 4.0, bilirubin: 0.8, ast: 25, alt: 30, lvef: 60, fev1: 80, drain_status: 'removed', discharge_disposition: 'home', los_days: 7, icu_days: 1 };
  }
  if (modName === 'tier156_tra_738') {
    if (fn === 'trauma_eval') return { ...base, iss: 16, ais_head: 2, ais_face: 1, ais_chest: 3, ais_abdomen: 2, ais_extremity: 2, ais_external: 1, mechanism: 'MVC', airway_secured: true, chest_tube: true, iv_access: true, gcs_total: 14, sbp: 110, hr: 95, mtp: false };
    if (fn === 'resus') return { ...base, crystalloid_ml: 1000, colloid_ml: 0, prbc_units: 0, ffp_units: 0, platelet_units: 0, cryo_units: 0, fibrinogen_grams: 0, factor_vii: 0, prothrombin: 1.0, mtp_activated: false, mtp_ratio: 0, reboa_used: 0, hr: 95, sbp: 110, lactate: 2.5, base_deficit: -3 };
    if (fn === 'damage_control') return { ...base, operation: 'laparotomy_packing', duration_min: 90, ebl_ml: 1500, phase1_time: 45, temp_control: true, coagulopathy_resolved: 12, time_to_icu: 5, packs_count: 4, phase2_time: 24, time_to_definitive: 36, fascial_closure_days: 5, abdominal_compartment: false, surgeon: 'dr_tr' };
    if (fn === 'complication') return { ...base, complication: 'AKI', severity: 'moderate', days_to_event: 2, ventilator_days: 5, icu_days: 8, hospital_days: 14, re_intubations: 0, ventilator_free_days: 25, dialysis_days: 3, tracheostomy: false };
    if (fn === 'outcome_trauma') return { ...base, disposition: 'home', icu_los: 5, hospital_los: 14, ventilator_days: 5, fim_score: 100, glasgow_outcome: 5, karnofsky: 90, return_to_work: true, driving_return: true, cause_death: 'none' };
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