// filepath: test_tier158_engines.js
const modules = [
  { mod: 'tier158_ivf_743', fns: ['consult','stim','retrieval','transfer','outcome'] },
  { mod: 'tier158_and_744', fns: ['semen','testosterone','ed','infertility_male','fertility_preservation'] },
  { mod: 'tier158_men_745', fns: ['assess','hot_flashes','hormone_therapy','bone_health','gsm'] },
  { mod: 'tier158_mif_746', fns: ['recurrent_loss','preconception','early_preg','ectopic','pregnancy_loss'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier158_ivf_743') {
    if (fn === 'consult') return { ...base, female_age: 35, male_age: 37, infertility_years: 2, cause: 'unexplained', amh: 2.5, fsh: 8, afc: 12, tubal_patent: true, sperm_count: 50 };
    if (fn === 'stim') return { ...base, protocol: 'antagonist', start_day: 2, total_fsh: 2000, total_hmg: 0, stim_days: 10, e2_day_trigger: 2500, endometrial_mm: 9, follicles_18: 4, follicles_14: 6, trigger: 'GnRH_agonist' };
    if (fn === 'retrieval') return { ...base, cycle_id: 'c1', eggs_retrieved: 12, mature_eggs_MII: 10, fertilized_2pn: 8, method: 'ICSI', duration_min: 20, ebl_ml: 5, complications: 'none', male_partner_count: 1 };
    if (fn === 'transfer') return { ...base, cycle_id: 'c1', day: 'day_5', embryos_available: 3, embryos_transferred: 1, embryos_grade: 4, endometrial_prep: 'HRT', endometrial_mm: 9, luteal_support: 'PIO', beta_hcg_result: 250, clinical_pregnancy: true };
    if (fn === 'outcome') return { ...base, cycle_id: 'c1', cycle_number: 1, result: 'clinical_pregnancy', gestational_age_weeks: 8, heart_rate_weeks_6: 120, babies: 1, birth_outcome: 'term', birth_weight_g: 3200, apgar_1: 8, apgar_5: 9 };
  }
  if (modName === 'tier158_and_744') {
    if (fn === 'semen') return { ...base, abstinence_days: 3, volume_ml: 2.5, ph: 7.5, concentration_m_ml: 60, motility_pct: 60, progressive_motility_pct: 50, morphology_strict_pct: 4, total_count: 150, total_motile_count: 90, morphology_who_pct: 4, interpretation: 'normozoospermia' };
    if (fn === 'testosterone') return { ...base, age: 50, total_t_ng_dl: 350, free_t_pg_ml: 8, shbg_nmol_l: 30, lh: 4, fsh: 3, prolactin: 10, estradiol: 25, diagnosis: 'eugonadal', trt_started: false, trt_route: 'none' };
    if (fn === 'ed') return { ...base, age: 55, iief_ef_score: 12, severity: 'moderate', cause: 'organic', cardiovascular_risk: true, treatment: 'PDE5i', attempts_per_month: 4, partner_involvement: true };
    if (fn === 'infertility_male') return { ...base, duration_months: 12, cause: 'varicocele', testis_volume_left_ml: 18, testis_volume_right_ml: 20, varicocele_present: true, varicocele_grade: 'II', fsh: 6, total_t: 400, karyotype: 46, y_chrom_microdeletion: false };
    if (fn === 'fertility_preservation') return { ...base, age: 28, indic: 'elective', pre_treatment_sperm_count: 80, straws_stored: 3, vials_stored: 6, cost_usd: 1500, method: 'sperm_freeze', storage_years_planned: 10, cancer_type: false };
  }
  if (modName === 'tier158_men_745') {
    if (fn === 'assess') return { ...base, age: 55, age_menarche: 12, age_menopause: 50, years_post_menopause: 5, years_amenorrhea: 5, menopause_stage: 'post_menopause', fsh: 80, estradiol: 30, amh: 0.1, hot_flashes: true, menopause_rating_scale: 18 };
    if (fn === 'hot_flashes') return { ...base, episodes_24h: 8, severity: 6, night_sweats_count: 3, sleep_disruption_pct: 50, affect_quality_life: true, triggers: 'stress', therapy: 'HRT_combined', days_since_start: 14 };
    if (fn === 'hormone_therapy') return { ...base, type: 'combined_EP', estradiol_dose_mcg: 100, progesterone_dose_mg: 100, duration_months: 24, route: 'oral', bleeding_pattern: 1, mammogram_count: 3, dexa_score: -1.5, bp: 130, indications: 'vasomotor', contraindications_count: 0 };
    if (fn === 'bone_health') return { ...base, age: 60, years_menopause: 10, bmd_lumbar_t: -2.5, bmd_hip_t: -1.8, bmd_femur_t: -2.0, frax_10yr_major: 12, frax_10yr_hip: 3, vitamin_d_25oh: 35, calcium_intake_mg: 1200, treatment: 'bisphosphonate', dexa_followup_years: 2 };
    if (fn === 'gsm') return { ...base, age: 58, years_menopause: 8, symptoms: 'dryness', severity: 5, vhi_score: 18, treatment: 'vaginal_estrogen', improvement_pct: 70, uti_recurrence: false };
  }
  if (modName === 'tier158_mif_746') {
    if (fn === 'recurrent_loss') return { ...base, losses_count: 3, gestational_age_max: 8, cause: 'APS', karyotype_count: 2, aps_workup: true, thrombophilia_workup: true, tsh: 2, prolactin: 12, amh: 2, anatomic_eval: true, treatment: 'aspirin' };
    if (fn === 'preconception') return { ...base, age: 32, bmi: 24, folic_acid_mcg: 400, preconception_counsel: true, immunizations_current: 1, medications_reviewed: 3, meds_teratogenic: 'none', hba1c: 5.5, tsh: 1.5, partner_screened: true };
    if (fn === 'early_preg') return { ...base, ga_days: 35, beta_hcg: 1500, progesterone: 18, location: 'intrauterine', heartbeat_seen: false, crl_mm: 2, gestational_sac_mm: 8, yolk_sac_mm: 3, bleeding: 'none', pain: 'none', subsequent_beta_hcg_48h: 3000 };
    if (fn === 'ectopic') return { ...base, ga_days: 49, beta_hcg: 3000, location: 'tubal_ampullary', mass_size_mm: 25, fetal_heart_activity: false, ruptured: false, hemoperitoneum_ml: 0, hemoglobin: 12, management: 'medical_mtx', mtx_dose_mg: 50, day_below_5_pct: 28 };
    if (fn === 'pregnancy_loss') return { ...base, ga_days: 56, type: 'missed', bleeding_score: 2, pain_score: 3, hemoglobin: 12, hemodynamically_stable: true, management: 'medical_misoprostol', tissue_passed_days: 4, followup_beta_hcg: 100, followup_days: 14 };
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