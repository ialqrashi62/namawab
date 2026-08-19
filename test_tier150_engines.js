// filepath: test_tier150_engines.js
const modules = [
  { mod: 'tier150_neu_709', fns: ['stroke','epilepsy','ms','movement','neuropathy'] },
  { mod: 'tier150_end_710', fns: ['dm_assess','dm_comp','thyroid','adrenal','bone'] },
  { mod: 'tier150_rhe_711', fns: ['ra','sle','vasculitis','spondylo','gout'] },
  { mod: 'tier150_hem_712', fns: ['anticoag','anticoag_bleed','thrombosis','apheresis','hematology_dx'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier150_neu_709') {
    if (fn === 'stroke') return { ...base, type: 'ischemic', nihss_admit: 8, nihss_24h: 4, nihss_discharge: 1, toast: 'cardioembolic', tpa_given: true, thrombectomy: false, door_to_needle_min: 35, door_to_groin_min: 60, mrs_discharge: 1 };
    if (fn === 'epilepsy') return { ...base, seizure_type: 'focal_impaired_awareness', frequency_per_month: 2, duration_sec: 60, eeg_finding: 'epileptiform_left', mri_finding: 'mesial_sclerosis', aed_count: 2, aed_levels: 'therapeutic', last_seizure_days: 14 };
    if (fn === 'ms') return { ...base, type: 'RRMS', edss: 3, relapse_count_2yr: 2, mri_lesions_t2: 12, mri_lesions_gad: 1, oled_band_count: 2, dmt: 'ocrelizumab', dmt_duration_months: 24, progression: false };
    if (fn === 'movement') return { ...base, disorder: 'Parkinsons', hoehn_yahr: 'II', updrs_total: 35, motor_complications: 'wearing_off', ledd_mg: 600, dbs_settings: 0, falls_30d: false, fall_count_30d: 0 };
    if (fn === 'neuropathy') return { ...base, type: 'diabetic', duration_months: 36, distribution: 'distal_symmetric', fiber_type: 'mixed', ncv_conduction: 35, emg_fibrillation: 2, pain_score: 6, treatment: 'gabapentin' };
  }
  if (modName === 'tier150_end_710') {
    if (fn === 'dm_assess') return { ...base, type: 'T2DM', hba1c_pct: 7.5, fbg_mg_dl: 130, bg_postprandial_mg_dl: 180, cgm_tir_pct: 65, cgm_tar_pct: 25, cgm_tbr_pct: 3, cgm_gmi: 7.2, cgm_cv: 30 };
    if (fn === 'dm_comp') return { ...base, retinopathy: 'mild_NPDR', neuropathy: 'peripheral', egfr: 75, uacr: 30, nephropathy: 'microalbuminuria', foot_ulcer: false, amputation_history: false, abi: 1.0, mnsi: 4 };
    if (fn === 'thyroid') return { ...base, diagnosis: 'Hashimoto', tsh: 5.5, ft4: 1.0, ft3: 2.5, tpo_ab: 'positive_high', tsi: 'negative', treatment: 'levothyroxine', dose_mcg: 75 };
    if (fn === 'adrenal') return { ...base, disorder: 'Conn', cortisol_am: 15, acth: 20, aldo: 30, renin: 1, aldo_renin_ratio: 30, dheas: 200, metanephrine: 50, normetanephrine: 100 };
    if (fn === 'bone') return { ...base, disorder: 'osteoporosis', bmd_lumbar_tscore: -2.8, bmd_hip_tscore: -2.0, bmd_femur_tscore: -2.3, ca: 9.5, po4: 3.5, pth: 60, vit_d_25oh: 30, treatment: 'bisphosphonate' };
  }
  if (modName === 'tier150_rhe_711') {
    if (fn === 'ra') return { ...base, tender_joint_28: 4, swollen_joint_28: 3, das28_crp: 3.2, das28_esr: 3.5, crp: 10, esr: 25, rf: 100, ccp: 'high_positive', erosions_on_xray: false, bdmard: 'methotrexate', remission: false };
    if (fn === 'sle') return { ...base, sledai: 6, dsna: 50, ana: 'high_titer', anti_smith: 'positive', anti_rnp: 'negative', anti_ssa: 'positive', anti_ssb: 'negative', c3: 80, c4: 15, organ_involvement: 'joints' };
    if (fn === 'vasculitis') return { ...base, type: 'ANCA_GPA', anca_pr3: 'high', anca_mpo: 'negative', crp: 50, esr: 60, renal_involvement: true, pulmonary_involvement: true, treatment: 'rituximab' };
    if (fn === 'spondylo') return { ...base, type: 'ankylosing_spondylitis', basdai: 5, basfi: 4, dactylitis_count: 0, enthesitis_count: 2, hla_b27: 'positive', crp: 20, sacroiliitis_on_mri: true, uveitis_history: false, treatment: 'anti_TNF' };
    if (fn === 'gout') return { ...base, sua: 8, crp: 15, tophi_count: 2, attacks_per_year: 4, joints_involved: 2, dactylitis: false, renal_stones: false, treatment: 'allopurinol', allopurinol_dose: 200 };
  }
  if (modName === 'tier150_hem_712') {
    if (fn === 'anticoag') return { ...base, indication: 'AFib', drug: 'apixaban', inr: 1.0, inr_target_low: 2, inr_target_high: 3, dose_mg: 5, crcl: 60, anti_xa_level: 'not_applicable', time_in_therapeutic_range: 70 };
    if (fn === 'anticoag_bleed') return { ...base, bleed_site: 'GI', severity: 'major', hgb_pre: 12, hgb_post: 8, inr_at_event: 2.5, days_since_dose: 1, reversal_given: true, reversal_agent: 'PCC_4_factor', dose_held: true };
    if (fn === 'thrombosis') return { ...base, event_type: 'DVT', location: 'proximal_LE', d_dimer: 1500, workup: 'imaging_confirmed', bnp: 100, troponin: 0.01, unprovoked: false, recurrence: false, workup_hypercoag: 'basic' };
    if (fn === 'apheresis') return { ...base, type: 'plasmapheresis', volume_processed_ml: 4000, replacement_fluid_ml: 3000, access: 'peripheral', plasma_exchange_volume: 1.0, duration_hr: 2, complications: false, replacement: 'albumin', indication: 'myasthenia_gravis' };
    if (fn === 'hematology_dx') return { ...base, diagnosis: 'iron_deficiency', hgb: 9, mcv: 75, retic: 1.5, ferritin: 15, b12: 400, haptoglobin: 120, ldh: 200, bilirubin_indirect: 0.5 };
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