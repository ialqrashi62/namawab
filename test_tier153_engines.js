// filepath: test_tier153_engines.js
const modules = [
  { mod: 'tier153_pon_721', fns: ['leukemia','brain_tumor','solid_peds','chemo_peds','late_effects'] },
  { mod: 'tier153_bmt_722', fns: ['donor_match','harvest','conditioning','engraftment','gvhd'] },
  { mod: 'tier153_phem_723', fns: ['sickle','hemophilia','thalassemia','itp','transfusion_peds'] },
  { mod: 'tier153_pic_724', fns: ['picu_admit','picu_vent','picu_drugs','sepsis_peds','picu_outcome'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier153_pon_721') {
    if (fn === 'leukemia') return { ...base, age_years: 5, wbc_dx: 50000, hgb_dx: 8, plt_dx: 30, blasts_pct: 80, diagnosis: 'B_ALL', risk: 'standard', cytogenetics: 'hyperdiploid', mrd_day33: 0.01, consolidation: 'COG_AALL0932' };
    if (fn === 'brain_tumor') return { ...base, location: 'posterior_fossa', diagnosis: 'medulloblastoma', molecular: 'WNT', resection_pct: 95, study: 'ACNS0334', craniospinal_radiation: true, radiation_dose_gy: 25, outcome: 'CR' };
    if (fn === 'solid_peds') return { ...base, tumor_type: 'neuroblastoma', stage: 'IV', tumor_size_cm: 8, resection_status: 'R1', molecular: 'MYCN_amp', risk: 'high', chemo_regimen: 'COG_ANBL' };
    if (fn === 'chemo_peds') return { ...base, protocol: 'COG_AALL', cycle: 1, day: 1, dose_mg_m2: 100, anc_pre: 0.8, plt_pre: 50, creatinine_pre: 0.4, full_dose_given: true, toxicity_grade: 'G2', supportive: 'growth_factor' };
    if (fn === 'late_effects') return { ...base, years_since_dx: 10, age_current: 15, dx_history: 'survivor_ALL', cardiotoxicity: false, neurocognitive: true, growth_failure: false, secondary_malignancy: false, fertility_affected: false, lv_ef_pct: 60, cumulative_doxorubicin_mg_m2: 200, passport: 'complete' };
  }
  if (modName === 'tier153_bmt_722') {
    if (fn === 'donor_match') return { ...base, donor_type: 'matched_unrelated', age_donor: 30, age_recipient: 10, hla_match_a: 2, hla_match_b: 2, hla_match_dr: 2, hla_match_total: 12, cpra_pct: 0, donor_weight_kg: 60, cmv_compatible: true, ab_o: 'compatible' };
    if (fn === 'harvest') return { ...base, donor_id: 'd1', method: 'PBSC_apheresis', cdbl_cell_dose: 5, tnc_dose: 8, cd34_dose: 5, volume_ml: 200, duration_hr: 4, adequate_collection: true, complications: 'none', manipulation: 'none' };
    if (fn === 'conditioning') return { ...base, case_id: 'c1', regimen: 'BU_FLU', day_minus: -5, dose_mg: 200, tbi_dose_cgy: 200, gvhd_prophylaxis: true, prophylaxis: 'PT_CY', cni_target_ng_ml: 200, antimicrobial: 'standard' };
    if (fn === 'engraftment') return { ...base, case_id: 'c1', day_neutrophil: 14, day_platelet: 21, donor_chimerism_pct_d30: 95, donor_chimerism_pct_d100: 100, donor_chimerism_pct_d365: 100, primary_graft_failure: false, secondary_graft_failure: false, failure_workup: 'complete', rescue_plan: 'none' };
    if (fn === 'gvhd') return { ...base, day_post: 30, type: 'acute_skin', skin_grade: 1, skin_stage: '2', liver_bili: 0.8, liver_stage: '0', gi_stage: '0', glucksberg_grade: 'I', treatment_line: 'steroid_topical' };
  }
  if (modName === 'tier153_phem_723') {
    if (fn === 'sickle') return { ...base, genotype: 'HbSS', hgb: 8, retic_pct: 12, hgb_f_pct: 10, hydroxyurea: 'yes', hydroxyurea_dose: 1000, last_voe_count_yr: 2, chronic_transfusion: false, iron_overload_ferritin: 200, iron_chelator: 'none' };
    if (fn === 'hemophilia') return { ...base, type: 'A_factor_8', severity: 'severe_less_1', baseline_factor_pct: 1, inhibitor_screen: false, inhibitor_titer: 'none', bleeds_per_year: 1, prophylaxis: 'emicizumab', bypassing_agent: 'none' };
    if (fn === 'thalassemia') return { ...base, type: 'beta_thal_major', hgb: 9, mcv: 70, hgb_f_pct: 80, hgb_a2_pct: 2.5, ferritin: 1500, transfusions_per_year: 12, splenectomy: false, lv_ef_pct: 60, chelation: 'deferasirox' };
    if (fn === 'itp') return { ...base, plt_count: 30, bleeding_score: 2, phase: 'new_diagnosis', treatment: 'IVIG', diagnosed_exclusion: true, duration_months: 1, marrow_done: false, outcome: 'partial_response' };
    if (fn === 'transfusion_peds') return { ...base, age_months: 36, weight_kg: 14, product: 'PRBC', volume_ml: 280, volume_ml_kg: 20, indication: 'symptomatic_anemia', pre_hgb: 7, post_hgb: 9, reaction: false, reaction_type: 'none' };
  }
  if (modName === 'tier153_pic_724') {
    if (fn === 'picu_admit') return { ...base, age_months: 24, weight_kg: 12, reason: 'respiratory_failure', pelod_score: 12, prism_score: 18, intubation: 'emergent', central_line: true, arterial_line: true, lactate: 3, inotrope_score: 10, disposition: 'PICU' };
    if (fn === 'picu_vent') return { ...base, mode: 'PRVC', pip_cmh2o: 25, peep_cmh2o: 5, rate_per_min: 25, fio2_pct: 50, tidal_ml_kg: 6, peak_inspiratory_ms: 800, weaning: 'planned_extubation', duration_hr: 72 };
    if (fn === 'picu_drugs') return { ...base, drug: 'epinephrine', dose_mcg_kg_min: 0.1, dose_mcg_kg_hr: 0, duration_hr: 24, titration: 'stable', inotrope_score: 15, vasoactive_index: 20, map_mmhg: 65, central_venous_p: 8, mixed_response: false };
    if (fn === 'sepsis_peds') return { ...base, temp_c: 39, hr: 180, rr: 50, bp: 65, capillary_refill: 4, lactate: 4, septic_shock: 'cold', fluid_boluses: 3, antibiotic_hour: 1, outcome: 'survived' };
    if (fn === 'picu_outcome') return { ...base, los_days: 5, disposition: 'ward', pelod_at_discharge: 5, functional_status: 4, pops_score: 'good', pcf_score: 3, family_meeting: 'yes', followup_psychology: true, death_cause: 'none' };
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