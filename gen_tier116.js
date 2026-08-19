// filepath: gen_tier116.js
const fs = require('fs');
const mounts = [
  { mount: '/api/pt_extended_v2', engine: 'tier116_pt_extended_610_engine', fns: ['manual_therapy','therapeutic_exercise','gait_analysis','aquatic_therapy','work_hardening'] },
  { mount: '/api/ot_extended_v2', engine: 'tier116_ot_extended_611_engine', fns: ['adl_training','splinting','assistive_tech','cognitive_rehab','work_rehab'] },
  { mount: '/api/st_voice_v2', engine: 'tier116_st_voice_612_engine', fns: ['articulation','language_therapy','voice_therapy','cognitive_communication','dysphagia'] },
  { mount: '/api/rehab_engineering_v2', engine: 'tier116_rehab_engineering_613_engine', fns: ['wheelchair_assessment','orthotic_fitting','prosthetic_assessment','adaptive_equipment','home_modifications'] },
  { mount: '/api/specialty_rehab_v2', engine: 'tier116_specialty_rehab_614_engine', fns: ['neuro_rehab','cardiac_rehab_phase1','pulmonary_rehab','burn_rehab','lymphedema'] },
];
for (const m of mounts) {
  const e = require('./' + m.engine);
  const fns = e.funcs();
  let r = `const express = require('express');\nconst router = express.Router();\nconst { funcs } = require('./${m.engine}');\nconst f = funcs();\nfunction asyncH(h) { return (req, res, next) => Promise.resolve(h(req, res, next)).catch(next); }\n`;
  for (const fn of m.fns) {
    r += `router.post('/${fn}', asyncH((req, res) => { const r = f.${fn}(req.body || {}); res.json({ ok: true, op: '${fn}', result: r }); }));\n`;
  }
  r += `module.exports = router;\n`;
  const routerFile = m.engine.replace('_engine', '_router') + '.js';
  fs.writeFileSync(routerFile, r);
  console.log('Wrote', routerFile);
}
const bodies = [
  {"patient_id":"R0","session_id":"mt_0","patient_id":"R0","technique":"mobilization","region":"cervical","duration_min":30,"pain_score_pre":7,"pain_score_post":4,"provider":"pt_001"},
  {"patient_id":"R1","session_id":"te_1","type":"strengthening","muscle_groups":3,"sets":3,"reps":10,"resistance_level":"medium","duration_min":45,"provider":"pt_001"},
  {"patient_id":"R2","analysis_id":"ga_2","patient_id":"R2","speed_m_per_s":1.2,"cadence_steps_per_min":110,"stride_length_m":1.1,"asymmetry_pct":5,"assistive_device":"none","provider":"pt_001"},
  {"patient_id":"R3","session_id":"aq_3","type":"pool","exercises":5,"duration_min":45,"temperature_c":32,"depth":"chest","provider":"pt_001"},
  {"patient_id":"R4","session_id":"wh_4","tasks":5,"duration_min":60,"heart_rate_max_pct":75,"tolerance":"good","provider":"pt_001"},
  {"patient_id":"R5","session_id":"ad_5","adl_type":"dressing","independence_level":"modified_independent","duration_min":30,"goal_progress_pct":70,"provider":"ot_001"},
  {"patient_id":"R6","fitting_id":"sp_6","patient_id":"R6","splint_type":"hand","material":"thermoplastic","wearing_schedule":"night","skin_integrity":1,"provider":"ot_001"},
  {"patient_id":"R7","assessment_id":"at_7","device":"smart_phone","purpose":"memory_aid","training_hours":3,"adoption":1,"provider":"ot_001"},
  {"patient_id":"R8","session_id":"cr_8","area":"memory","tasks":4,"score_pre":15,"score_post":22,"duration_min":45,"provider":"ot_001"},
  {"patient_id":"R9","plan_id":"wr_9","goals":4,"work_simulation_hours":10,"tolerance":"improved","placement":"trial","provider":"ot_001"},
  {"patient_id":"R10","session_id":"ar_10","sound":"r","accuracy_pre":0.4,"accuracy_post":0.7,"trials":20,"cueing":"minimal","provider":"st_001"},
  {"patient_id":"R11","session_id":"lt_11","type":"receptive","modality":"play_based","targets":5,"accuracy_pre":0.3,"accuracy_post":0.6,"provider":"st_001"},
  {"patient_id":"R12","session_id":"vt_12","voice_type":"dysphonia","tasks":3,"baseline_hz":150,"target_hz":180,"perceived_effort":3,"provider":"st_001"},
  {"patient_id":"R13","session_id":"cc_13","area":"attention","tasks":5,"score_pre":50,"score_post":65,"compensation_strategy":"external_memory","provider":"st_001"},
  {"patient_id":"R14","assessment_id":"dy_14","patient_id":"R14","diet_level":"nectar","trial_count":5,"aspiration_signs":0,"penetration":"shallow","provider":"st_001"},
  {"patient_id":"R15","assessment_id":"wc_15","patient_id":"R15","weight_kg":70,"measurements":{"seat_width_cm":45,"depth_cm":43,"height_cm":46},"propulsion":"self","satisfaction":9,"provider":"re_001"},
  {"patient_id":"R16","fitting_id":"or_16","patient_id":"R16","device":"afo","type":"custom","complications":0,"wearing_tolerance_hr":8,"provider":"re_001"},
  {"patient_id":"R17","assessment_id":"pr_17","amputation_level":"below_knee","residual_length_cm":15,"prosthesis_type":"microprocessor","socket_fit":"good","provider":"re_001"},
  {"patient_id":"R18","device_id":"ae_18","device":"grab_bar","location":"bathroom","training_hours":1,"adoption":1,"provider":"re_001"},
  {"patient_id":"R19","assessment_id":"hm_19","ramps":2,"grab_bars":4,"doorway_widening":0,"cost_dollars":5500,"provider":"re_001"},
  {"patient_id":"R20","session_id":"nr_20","type":"gait","asymmetry_pct":10,"muscle_strength":"3+/5","balance_score":75,"functional_independence_measure":80,"provider":"sr_001"},
  {"patient_id":"R21","session_id":"cr_21","phase":"phase_1","duration_min":30,"exercise":"treadmill","intensity":"moderate","vo2_max":20,"duration_weeks":6,"provider":"sr_001"},
  {"patient_id":"R22","session_id":"pr_22","exercises":4,"duration_min":45,"intensity":"moderate","dyspnea_scale":3,"endurance_min":20,"provider":"sr_001"},
  {"patient_id":"R23","session_id":"br_23","type":"mobility","exercise":"rom","rom_degrees_pct":80,"pain_score":3,"wound_healing_status":"healing","provider":"sr_001"},
  {"patient_id":"R24","session_id":"ly_24","limb":"left_arm","volume_ml":500,"excess_pct":15,"compression_garment":"sleeve","lymphedema_grade":"mild","provider":"sr_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');