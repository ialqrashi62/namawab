// filepath: gen_tier107.js
const fs = require('fs');
const mounts = [
  { mount: '/api/nursing_assess_v2', engine: 'tier107_nursing_assess_561_engine', fns: ['vital_signs','pain_assessment','fall_risk','braden_scale','nursing_diagnosis'] },
  { mount: '/api/nursing_med_admin_v2', engine: 'tier107_nursing_med_admin_562_engine', fns: ['medication_administration','barcode_scanning','iv_pump_programming','double_check_medication','medication_reconciliation'] },
  { mount: '/api/wound_care_v2', engine: 'tier107_wound_care_563_engine', fns: ['wound_assessment','dressing_change','pressure_injury','ostomy_care','wound_healing'] },
  { mount: '/api/iv_therapy_v2', engine: 'tier107_iv_therapy_564_engine', fns: ['iv_insertion','iv_maintenance','central_line','phlebotomy','infusion_reaction'] },
  { mount: '/api/allied_health_v2', engine: 'tier107_allied_health_565_engine', fns: ['physical_therapy','occupational_therapy','speech_therapy','respiratory_therapy','dietary_consult'] },
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
  {"patient_id":"N0","assessment_id":"vs_0","temperature_c":37.2,"heart_rate":78,"respiratory_rate":16,"bp_systolic":118,"bp_diastolic":75,"oxygen_saturation":98,"provider":"rn_001"},
  {"patient_id":"N1","assessment_id":"pa_1","pain_score":6,"scale":"numeric","duration_min":120,"location":"abdomen","character":"cramping","provider":"rn_001"},
  {"patient_id":"N2","assessment_id":"fr_2","morse_fall_score":45,"age":72,"history_of_falling":1,"ambulatory_aid":true,"iv_heparin":true,"risk_level":"high","provider":"rn_001"},
  {"patient_id":"N3","assessment_id":"bs_3","sensory_perception":3,"moisture":3,"activity":2,"mobility":3,"nutrition":3,"friction_shear":2,"risk_level":"moderate","provider":"rn_001"},
  {"patient_id":"N4","diagnosis_id":"nd_4","category":"pain","priority":"medium","nursing_intervention":"analgesia_admin","expected_outcome_score":7,"status":"active","provider":"rn_001"},
  {"patient_id":"N5","administration_id":"ma_5","medication":"morphine","dose_mg":2,"route":"iv","time_to_admin":5,"patient_identification_verified":true,"allergy_verified":true,"provider":"rn_001"},
  {"patient_id":"N6","scan_id":"bs_6","patient_wristband_scanned":true,"medication_barcode_scanned":true,"matched":true,"scan_duration":2,"outcome":"administered","provider":"rn_001"},
  {"patient_id":"N7","program_id":"iv_7","medication":"heparin","rate_ml_hr":25,"volume_ml":250,"duration_hours":10,"safety_software":true,"outcome":"infusing","provider":"rn_001"},
  {"patient_id":"N8","check_id":"dc_8","medication":"insulin","primary_nurse":"rn_a","secondary_nurse":"rn_b","dose_agreement":1,"route_agreement":true,"outcome":"administered","provider":"rn_001"},
  {"patient_id":"N9","reconciliation_id":"mr_9","admission_meds":8,"discharge_meds":9,"discrepancies":2,"resolved_count":2,"accuracy":"complete","provider":"rn_001"},
  {"patient_id":"N10","assessment_id":"wa_10","wound_type":"surgical","length_cm":4,"width_cm":2,"depth_cm":1,"stage":"II","exudate":"serous","provider":"rn_001"},
  {"patient_id":"N11","change_id":"dc_11","wound_id":"wa_10","dressing_type":"hydrocolloid","change_frequency":"every_3_days","duration_min":15,"provider":"rn_001"},
  {"patient_id":"N12","injury_id":"pi_12","location":"sacrum","stage":"III","length_cm":5,"width_cm":4,"treatment":"debridement","provider":"rn_001"},
  {"patient_id":"N13","care_id":"os_13","ostomy_type":"colostomy","output_volume_ml":350,"skin_condition":"intact","appliance_change":true,"education_provided":true,"provider":"rn_001"},
  {"patient_id":"N14","assessment_id":"wh_14","granulation_pct":75,"epithelialization_pct":50,"infection_signs":0,"healing_rate":"adequate","provider":"rn_001"},
  {"patient_id":"N15","insertion_id":"ii_15","site":"r_forearm","gauge":20,"attempts":1,"success":true,"complications":0,"provider":"rn_001"},
  {"patient_id":"N16","maintenance_id":"im_16","line_id":"ii_15","site_assessment":"clean","dressing_change":true,"tubing_change":true,"lumen_patent":true,"provider":"rn_001"},
  {"patient_id":"N17","placement_id":"cl_17","line_type":"picc","site":"basilic","verification":"tip_echo","complications":0,"first_use":"same_day","provider":"rn_001"},
  {"patient_id":"N18","draw_id":"ph_18","site":"antecubital","tubes_collected":3,"attempts":1,"patient_comfort":"tolerated","provider":"rn_001"},
  {"patient_id":"N19","reaction_id":"ir_19","medication":"vancomycin","reaction_type":"red_man","severity":"mild","intervention":"slow_infusion","outcome":"resolved","provider":"rn_001"},
  {"patient_id":"N20","session_id":"pt_20","type":"therapeutic_exercise","duration_min":30,"intensity":"moderate","exercises":5,"progress":"improving","provider":"pt_001"},
  {"patient_id":"N21","session_id":"ot_21","type":"adl_training","duration_min":45,"goal":"independence_in_dressing","progress":70,"provider":"ot_001"},
  {"patient_id":"N22","session_id":"st_22","type":"swallowing_therapy","duration_min":30,"diet_level":"nectar_thick","swallow_score":7,"provider":"st_001"},
  {"patient_id":"N23","session_id":"rt_23","type":"nebulizer","treatment":"albuterol","duration_min":15,"response":"improved","peak_flow":350,"provider":"rt_001"},
  {"patient_id":"N24","consult_id":"dc_24","caloric_needs":2200,"protein_needs_g":110,"diet":"regular","education":"diabetic","appetite":"fair","provider":"rd_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');