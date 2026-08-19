// filepath: test_tier148_engines.js
const modules = [
  { mod: 'tier148_onc_701', fns: ['staging','tnm','targeted','rad_onc','follow_up'] },
  { mod: 'tier148_obg_702', fns: ['prenatal','labor','delivery','pp_care','gyn_proc'] },
  { mod: 'tier148_nic_703', fns: ['admit','vent','feeding','sepsis_screen','discharge'] },
  { mod: 'tier148_bld_704', fns: ['donor_screen','unit','crossmatch','transfusion_event','inventory'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier148_onc_701') {
    if (fn === 'staging') return { ...base, cancer_type: 'breast', tnm_t: 'T2', tnm_n: 'N1', tnm_m: 'M0', stage_group: 'IIB', tumor_size_cm: 3, metastasis: false };
    if (fn === 'tnm') return { ...base, case_id: 'c1', tumor_size_cm: 3, nodes_examined: 10, nodes_positive: 2, depth_invasion_mm: 15, lvi: 'absent', pni: 'absent', grade: 'G2', margin: 'negative' };
    if (fn === 'targeted') return { ...base, drug: 'trastuzumab', target: 'HER2', line: 'adjuvant', cycle: 1, response: 'PR', pfs_months: 12 };
    if (fn === 'rad_onc') return { ...base, modality: 'IMRT', total_dose_gy: 50, fractions: 25, dose_per_fraction_gy: 2, site: 'breast', completed: true, toxicity: 'none' };
    if (fn === 'follow_up') return { ...base, status: 'NED', months_dx: 12, months_followup: 12, recurrence: false, recurrence_site: 'NA', next_imaging: 'CT', next_visit_days: 90 };
  }
  if (modName === 'tier148_obg_702') {
    if (fn === 'prenatal') return { ...base, ga_weeks: 32, ga_days: 4, fetal_hr: 140, fundal_height_cm: 32, efw_grams: 1800, amnio: 'intact', af_index: 12, bishop_score: 6 };
    if (fn === 'labor') return { ...base, stage: 'active_1st', cervical_dilation_cm: 6, effacement_pct: 80, station: 0, contractions_per_10min: 4, fetal_monitor: 'category_I', duration_hr: 8, analgesia: 'epidural' };
    if (fn === 'delivery') return { ...base, mode: 'spontaneous_vaginal', ebl_ml: 300, apgar_1: 8, apgar_5: 9, weight_grams: 3200, sex: 'M', complications: false, complications_text: 'none', length_of_labor_hr: 12 };
    if (fn === 'pp_care') return { ...base, pp_day: 'day_1', lochia_amount: 30, lochia_color: 'rubra', fundal_height_cm: 18, episiotomy: 'none', breastfeeding: true, mood: 'normal', contraception: 'IUD' };
    if (fn === 'gyn_proc') return { ...base, procedure: 'hysteroscopy', ebl_ml: 50, duration_min: 30, complications: 'none', pathology_sent: false, finding: 'normal', surgeon: 'dr_g' };
  }
  if (modName === 'tier148_nic_703') {
    if (fn === 'admit') return { ...base, birth_id: 'b1', ga_weeks: 32, birth_weight_grams: 1800, level: 'III_NICU', apgar_1: 7, apgar_5: 9, head_circumference_cm: 30, length_cm: 42, resuscitation: 'bag_mask', admit_diagnosis: 'preterm' };
    if (fn === 'vent') return { ...base, mode: 'SIMV', pip_cmh2o: 20, peep_cmh2o: 5, rate_per_min: 30, fio2_pct: 30, tidal_ml_kg: 5, mve_l_min: 1.5, indication: 'RDS', duration_hr: 48 };
    if (fn === 'feeding') return { ...base, type: 'human_milk', feed_volume_ml_kg_day: 120, feed_interval_hr: 3, route: 'OG', tolerance: true, complications: 'none', weight_gain_g_day: 20 };
    if (fn === 'sepsis_screen') return { ...base, wbc: 5, it_ratio: 0.1, crp: 5, culture_count: 1, pathogen: 'none', antibiotic: 'none', days_antibiotic: 0, meningitis: false };
    if (fn === 'discharge') return { ...base, los_days: 21, discharge_weight_grams: 2300, feeding_at_discharge: 'breast', car_seat_test: true, hearing_screen: true, metabolic_screen: true, shot_hepB: true, followup: 'PCP_2d' };
  }
  if (modName === 'tier148_bld_704') {
    if (fn === 'donor_screen') return { ...base, donor_id: 'd1', donor_type: 'volunteer', age: 30, weight_kg: 70, hgb: 14, bp_systolic: 120, pulse: 72, travel_history: 'none', hiv_test: true, hep_b_test: true, hep_c_test: true, syphilis_test: true };
    if (fn === 'unit') return { ...base, donor_id: 'd1', product: 'PRBC', abo: 'O', rh: 'positive', volume_ml: 350, collection_date: 20260101, expiration_date: 20260215, irradiated: false, cmv_negative: false, storage_temp_c: '4' };
    if (fn === 'crossmatch') return { ...base, patient_id: 'p1', donor_id: 'd1', unit_id: 'u1', method: 'AHG', abo_compatible: 'compatible', antibody_screen: false, antibody_id: false, dat_positive: false, titer: 0, result: 'compatible' };
    if (fn === 'transfusion_event') return { ...base, patient_id: 'p1', unit_id: 'u1', start_time: 1000, end_time: 1030, volume_infused_ml: 350, vital_signs_stable: 'stable', reaction_suspected: false, reaction_type: 'none', workup_performed: false };
    if (fn === 'inventory') return { ...base, product: 'PRBC', abo: 'all', units_available: 50, units_in_use: 10, units_expired_30d: 2, units_out_30d: 20, days_supply: 14, alert_level: 'green', action: 'none' };
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