// filepath: test_tier163_engines.js
const ENGINE_TESTS = [
  { mod: 'tier163_aes_763', fns: ['pilot_medical','decompression_sick','gas_toxicity','barotrauma','hypoxia_aviation'] },
  { mod: 'tier163_div_764', fns: ['dive_fitness','decompression_sick2','gas_toxicity2','barotrauma2','hyperbaric_treat'] },
  { mod: 'tier163_mar_765', fns: ['seasickness','hypothermia','drowning','envenomation','dive_emergency'] },
  { mod: 'tier163_mil_766', fns: ['triage','combat_casualty','vaccine_mil','biodefense','fit_for_duty'] }
];
const base = { tenant_id: 't1', patient_id: 'p1', provider: 'p' };
function bodyFor(mod, fn) {
  const r = { ...base };
  if (mod === 'tier163_aes_763') {
    if (fn === 'pilot_medical') return { ...base, age: 35, cert_class: '1st', flight_hours: 2000, bp_systolic: 125, hr: 70, bmi: 25, cardiovascular: 'normal', electrocardiogram: true, vision: '20_20', disposition: 'issued' };
    if (fn === 'decompression_sick') return { ...base, depth_max_m: 30, bottom_time_min: 30, ascent_rate_m_min: 10, surface_interval_min: 60, symptom: 'joint', symptom_onset_min: 30, recurrent: false, severity: 'mild', treatment: true };
    if (fn === 'gas_toxicity') return { ...base, gas_type: 'CO2', exposure_ppm: 5000, exposure_duration_min: 30, symptoms: true, symptom_type: 'neuro', examination_level: 1, outcome: 'subclinical', treatment_lag_min: 10 };
    if (fn === 'barotrauma') return { ...base, location: 'middle_ear', depth_at_injury_m: 10, ascent_rate_m_min: 15, pain_score: 7, perforation: false, grade: '2', hearing_change_dB: 10, treatment: 'decongestant', followup_days: 7 };
    if (fn === 'hypoxia_aviation') return { ...base, altitude_ft: 25000, cabin_pressure_inHg: 20, spo2: 88, symptom_onset_min: 30, symptom: 'moderate', oxygen_duration_min: 30, full_recovery: true, disposition: 'continue', followup_days: 1 };
  }
  if (mod === 'tier163_div_764') {
    if (fn === 'dive_fitness') return { ...base, age: 30, dive_cert: 'AOW', max_depth_m: 30, total_dives: 50, medical_clearance: true, pulmonary_function: 'normal', cardiac_clearance: true, ent_clearance: true, neurologic: 'normal', fitness: 'medically_fit' };
    if (fn === 'decompression_sick2') return { ...base, depth_max_m: 40, bottom_time_min: 25, ascent_rate_m_min: 9, surface_interval_min: 30, symptom: 'neurologic', severity: 'moderate', treatment_given: true, recompression_table: 'USN_6', outcome: 'partial', time_to_treat_min: 60 };
    if (fn === 'gas_toxicity2') return { ...base, gas_type: 'CO', exposure_ppm: 100, exposure_duration_min: 60, symptoms: true, carboxyhemoglobin_pct: 15, treatment: '100_pct_oxygen', duration_min: 90, outcome: 'recovered', followup_days: 1 };
    if (fn === 'barotrauma2') return { ...base, location: 'sinus', depth_at_injury_m: 5, ascent_rate_m_min: 20, pain_score: 6, perforation: false, treatment: 'decongestant', complication: 'none', hearing_change_dB: 0, followup_days: 7 };
    if (fn === 'hyperbaric_treat') return { ...base, depth_ft: 60, gas_mix: 1.4, duration_min: 90, session_count: 5, indication: 'DCS', improvement: true, oxygen_toxicity: false, complication: 'none', tolerated: 'well' };
  }
  if (mod === 'tier163_mar_765') {
    if (fn === 'seasickness') return { ...base, age: 30, sea_state: 'moderate', duration_hr: 4, severity: 5, symptoms: 'vomiting', medication: 'meclizine', iv_fluids: true, dehydrated: true };
    if (fn === 'hypothermia') return { ...base, age: 30, water_temp_c: 5, immersion_min: 30, core_temp_c: 32, severity: 'moderate', cardiac_arrest: false, treatment: 'passive_rewarming', warming_time_min: 60, outcome: 'recovered' };
    if (fn === 'drowning') return { ...base, age: 25, water_type: 'salt', submersion_min: 5, cpr_done: true, cpr_min: 10, spo2_first: 88, gcs_first: 8, intubation: true, outcome: 'survived', icu_days: 5 };
    if (fn === 'envenomation') return { ...base, age: 35, organism: 'jellyfish', contact_min: 5, envenomation_score: 4, antivenom: false, treatment: 'hot_water', symptom: 'localized_pain', progression: 'localized', outcome: 'healed' };
    if (fn === 'dive_emergency') return { ...base, age: 30, depth_m: 30, ascent_type: 'emergency', symptom: 'paralysis', severity: 'severe', recompression: true, time_to_chamber_min: 60, outcome: 'partial', intubation: false };
  }
  if (mod === 'tier163_mil_766') {
    if (fn === 'triage') return { ...base, age: 25, category: 'T1_immediate', bp_systolic: 80, hr: 120, rr: 25, gcs: 10, mechanism: 'blast', iss: 25, triage_tag: 'red', transport_priority: 1 };
    if (fn === 'combat_casualty') return { ...base, age: 25, injury_type: 'hemorrhage', time_to_care_min: 10, blood_loss_ml: 2000, battle_pressure: 'high', tourniquet_min: 30, tourniquet_used: true, blood_products_ml: 1000, damage_control_done: 1, outcome: 'alive_evac' };
    if (fn === 'vaccine_mil') return { ...base, age: 25, deployment_region: 'middle_east', vaccine: 'typhoid', dose_number: 1, doses_total: 1, contraindication: false, observation_min: 30, ae: false, readiness: 'full' };
    if (fn === 'biodefense') return { ...base, agent: 'anthrax', exposure_type: 'inhalation', exposure_level: 3, decontamination_min: 5, isolation: true, prophylaxis: 'ABX', contact_tracing: true, quarantine: 'none', followup_days: 60 };
    if (fn === 'fit_for_duty') return { ...base, age: 30, unit_type: 'combat', years_service: 10, duty_station: 'deployed', fitness_pct: 90, psych_clear: 1, disposition: 'fit', discharge_type: 'none', deployment_ready: true };
  }
  return r;
}
let pass = 0, fail = 0;
for (const t of ENGINE_TESTS) {
  const { funcs } = require('./' + t.mod + '_engine.js');
  const f = funcs();
  for (const fn of t.fns) {
    const b = bodyFor(t.mod, fn);
    try {
      const out = f[fn](b);
      if (out && out.patient_id) { console.log('OK', t.mod + '.' + fn); pass++; }
      else { console.log('FAIL', t.mod + '.' + fn, 'no patient_id'); fail++; }
    } catch (e) {
      console.log('FAIL', t.mod + '.' + fn + ':', e.message);
      fail++;
    }
  }
}
console.log('TOTALS: pass=' + pass + ' fail=' + fail);