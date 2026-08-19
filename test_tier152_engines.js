// filepath: test_tier152_engines.js
const modules = [
  { mod: 'tier152_pdc_717', fns: ['fetal_echocardiogram','congenital_dx','peds_cath','arrhythmia_peds','single_ventricle'] },
  { mod: 'tier152_pcs_718', fns: ['norwood','glenn','fontan','arterial_switch','tetralogy_repair'] },
  { mod: 'tier152_pgu_719', fns: ['well_visit','developmental','immunizations','new_born','adolescent'] },
  { mod: 'tier152_chi_720', fns: ['chd_followup','adult_chd','transition','long_term_outcome','cardiopulmonary_exercise'] }
];
function makeBody(modName, fn) {
  const base = { tenant_id: 't1', patient_id: 'p1', provider: 'prov' };
  if (modName === 'tier152_pdc_717') {
    if (fn === 'fetal_echocardiogram') return { ...base, fetus_id: 'f1', ga_weeks: 22, heart_rate: 145, indication: 'maternal_diabetes', diagnosis: 'normal', cardio_thoracic_ratio: 0.5, ventricular_size: 10, great_vessel_ratio: 1, fluid_effusion: false };
    if (fn === 'congenital_dx') return { ...base, age_months: 6, lesion: 'VSD', size_mm: 5, gradient_mmhg: 30, shunt: 'L_R', saturation_pct: 96, lvef_pct: 60, cyanosis: false, failure_to_thrive: false };
    if (fn === 'peds_cath') return { ...base, type: 'diagnostic', age_months: 12, weight_kg: 8, fluoro_min: 30, dose_mgy: 20, access: 'femoral', contrast_ml: 30, ebl_ml: 10, successful: true, complication: 'none' };
    if (fn === 'arrhythmia_peds') return { ...base, type: 'WPW', age_onset_months: 60, hr_max: 220, hr_min: 80, sustained: true, episode_count: 5, ablation_done: true, recurrence: false, medication: 'beta_blocker', sudden_risk: 'low' };
    if (fn === 'single_ventricle') return { ...base, anatomy: 'HLHS', stage: 2, stage_age_months: 6, stage_type: 'stage_2_glenn', completed: true, saturation_pct: 82, lvef_pct: 55, fenestration: false, band_pressure: 18 };
  }
  if (modName === 'tier152_pcs_718') {
    if (fn === 'norwood') return { ...base, case_id: 'c1', age_days: 5, weight_kg: 3, diagnosis: 'HLHS', modification: 'norwood_modified', cpb_min: 180, cross_clamp_min: 90, dhca_min: 30, circulatory_arrest_min: 30, ebl_ml: 200, shunt: 'BT_4', surgeon: 'dr_cs' };
    if (fn === 'glenn') return { ...base, case_id: 'c2', age_months: 6, weight_kg: 6, preop_saturation_pct: 80, cpb_min: 90, cross_clamp_min: 0, type: 'bidirectional_G', fenestration: false, azygos_ligation: true, ebl_ml: 100, surgeon: 'dr_cs' };
    if (fn === 'fontan') return { ...base, case_id: 'c3', age_years: 3, weight_kg: 14, type: 'extracardiac', conduit_size_mm: 18, cpb_min: 120, cross_clamp_min: 30, fenestration: true, fenestration_size_mm: 4, preop_saturation_pct: 85, surgeon: 'dr_cs' };
    if (fn === 'arterial_switch') return { ...base, case_id: 'c4', age_days: 7, weight_kg: 3.5, diagnosis: 'simple_TGA', cpb_min: 150, cross_clamp_min: 80, dhca_min: 30, lef_atrial_coronary_reimplant: true, lecompte_maneuver: true, ebl_ml: 150, surgeon: 'dr_cs' };
    if (fn === 'tetralogy_repair') return { ...base, case_id: 'c5', anatomy: 'TOF', age_months: 8, weight_kg: 8, cpb_min: 120, cross_clamp_min: 70, rvot_repair: 'transannular_patch', ebl_ml: 150, residual: 'mild_PI', surgeon: 'dr_cs' };
  }
  if (modName === 'tier152_pgu_719') {
    if (fn === 'well_visit') return { ...base, age_months: 12, weight_kg: 10, height_cm: 75, head_circumference_cm: 46, bmi: 17.7, feeding: 'mixed', meals_per_day: 4, sleep_hours: 12, development: 'normal', vaccines_updated: true };
    if (fn === 'developmental') return { ...base, age_months: 24, gross_motor_age_eq: 24, fine_motor_age_eq: 22, language_age_eq: 18, social_age_eq: 24, screening: 'normal', referred_EI: false, referred_specialist: false, diagnosis: 'normal' };
    if (fn === 'immunizations') return { ...base, age_months: 6, vaccine: 'DTaP', dose_number: 3, dose_date_age: 6, site: 'IM_left_thigh', reaction: false, reaction_type: 'none', contraindication: false };
    if (fn === 'new_born') return { ...base, age_hours: 6, birth_weight_grams: 3200, gestational_age_weeks: 39, apgar_1: '8', apgar_5: '9', cord_ph: '>7.25', first_temp_c: 36.8, breastfeeding_init: true, meconium_passed_hr: 12, urine_passed_24h: true };
    if (fn === 'adolescent') return { ...base, age_years: 15, tanner_stage: 'IV', substance_use_screen: true, depression_screen: true, phq9_score: 'none_0_4', contraception_discussed: true, sexual_activity_screen: true, bmi: 22, risk_assessment: 'low' };
  }
  if (modName === 'tier152_chi_720') {
    if (fn === 'chd_followup') return { ...base, diagnosis: 'post_op_TOF', age_years: 12, saturation_pct: 96, lvef_pct: 60, nyha_or_equivalent: 'I', chest_pain: false, exercise_intolerance: false, last_echo_ef: 60, last_cath_days: 730, meds: 'none' };
    if (fn === 'adult_chd') return { ...base, age_years: 30, diagnosis: 'post_op_Fontan', pregnancy_risk: true, pregnancy_planned: false, lvef_pct: 50, rv_ef_pct: 45, functional_status: 'II', transplant_eval: false, pulmonary_pressure: 18, saturation_pct: 92 };
    if (fn === 'transition') return { ...base, age_years: 18, readiness: 'action', transition_clinic: true, adult_cardiologist_identified: true, insurance_continued: true, self_management_skills: true, transition_visits: 3, reproductive_counseled: true, school_career_planning: true };
    if (fn === 'long_term_outcome') return { ...base, age_years: 25, status: 'alive_well', years_since_surgery: 22, number_of_reinterventions: 0, function: 'normal', employment: true, marrige_or_partner: true, children: false, quality_of_life_score: 90 };
    if (fn === 'cardiopulmonary_exercise') return { ...base, age_years: 16, vo2_max: 35, vo2_predicted_pct: 85, work_max_watts: 200, work_predicted_pct: 90, ve_vco2_slope: 28, rer: 1.1, hr_max: 195, o2_pulse: 12, saturation_min: 92, reason_termination: 'max_effort' };
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