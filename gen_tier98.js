// filepath: gen_tier98.js
const fs = require('fs');
const mounts = [
  { mount: '/api/cardio_acute_v2', engine: 'tier98_cardio_acute_513_engine', fns: ['stemi','nstemi','heart_failure','cardiogenic_shock','arrhythmia_acute'] },
  { mount: '/api/cardio_imaging_v2', engine: 'tier98_cardio_imaging_514_engine', fns: ['echocardiogram','cardiac_mri','cardiac_ct','stress_test','holter_monitoring'] },
  { mount: '/api/cardio_intervention_v2', engine: 'tier98_cardio_intervention_515_engine', fns: ['pci','cabg','device_implant','ablation','tavr'] },
  { mount: '/api/cardio_ep_v2', engine: 'tier98_cardio_electrophysiology_516_engine', fns: ['pacemaker_followup','icd_followup','anticoagulation_cardio','lipid_management','cardiac_rehab'] },
  { mount: '/api/cardio_valve_v2', engine: 'tier98_cardio_valve_517_engine', fns: ['aortic_stenosis','mitral_regurgitation','tricuspid_regurg','valve_surgery','endocarditis'] },
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
  {"patient_id":"C0","episode_id":"ce_0","stemi_type":"anterior","systolic_bp":120,"door_to_balloon":45,"troponin_peak":15.5,"ef":40,"reperfusion":"pci","killip_class":1,"provider":"cr_001"},
  {"patient_id":"C1","episode_id":"ce_1","nstemi_type":"nstemi","troponin_peak":3.5,"grace_score":120,"treatment":"pci","lvef":45,"hospital_days":4,"complications":"none","provider":"cr_001"},
  {"patient_id":"C2","assessment_id":"ca_2","nyha_class":"3","ef":30,"bnp":850,"weight_change_kg":3,"systolic_bp":110,"diuretic_use":true,"fluid_balance":-1500,"phenotype":"hfref","provider":"cr_001"},
  {"patient_id":"C3","episode_id":"cs_3","ci":1.5,"sbp":75,"lactate":6.5,"vasopressors":true,"number_pressors":2,"mechanical_circulatory":true,"icu_days":5,"provider":"cr_001"},
  {"patient_id":"C4","episode_id":"ca_4","arrhythmia_type":"afib","heart_rate":160,"hemodynamic_instability":true,"reversion_method":1,"cardioversion":true,"cpr_required":false,"provider":"cr_001"},
  {"patient_id":"C5","study_id":"cs_5","type":"ttte","ef":45,"lv_diastolic_diameter":55,"lv_systolic_diameter":40,"wall_motion":"hypokinesia","valve_disease_count":1,"pulmonary_pressure":35,"provider":"cr_001"},
  {"patient_id":"C6","study_id":"cm_6","ef":40,"lv_mass":180,"lv_volume":180,"fibrosis_pct":15,"lge_present":"present","t2_signal":2,"pericardial_effusion":0,"provider":"cr_001"},
  {"patient_id":"C7","study_id":"cc_7","type":"ccta","calcium_score":250,"stenosis_pct":70,"plaques_count":4,"segments_involved":3,"high_risk_plaques":2,"triple_vessel":"no","provider":"cr_001"},
  {"patient_id":"C8","study_id":"ss_8","protocol":"exercise","mets_achieved":8,"max_heart_rate":155,"inducible_ischemia":"present","st_depression_mm":2,"exercise_minutes":9,"response":"abnormal","provider":"cr_001"},
  {"patient_id":"C9","study_id":"ho_9","duration_hours":24,"min_heart_rate":45,"max_heart_rate":140,"avg_heart_rate":75,"pvc_count":250,"pac_count":150,"afib_burden_pct":15,"provider":"cr_001"},
  {"patient_id":"C10","procedure_id":"cp_10","indication":"stemi","lesions_treated":1,"stents_placed":1,"contrast_volume_ml":150,"fluoroscopy_time":12,"approach":"radial","complications":"none","provider":"cr_001"},
  {"patient_id":"C11","procedure_id":"cb_11","age":68,"euro_score":4.5,"grafts":3,"pump_use":true,"bypass_time":85,"icu_days":2,"hospital_days":7,"complications":1,"provider":"cr_001"},
  {"patient_id":"C12","procedure_id":"di_12","device_type":"dual_chamber","ef":30,"fluoroscopy_time":15,"hospital_days":1,"complications":false,"thresholds":1.0,"sensing":3.5,"provider":"cr_001"},
  {"patient_id":"C13","procedure_id":"ab_13","type":"afib","duration_min":180,"fluoroscopy_time":25,"successful":true,"recurrence_3mo":1,"complications":0,"provider":"cr_001"},
  {"patient_id":"C14","procedure_id":"tv_14","sts_score":4.5,"age":82,"approach":"transfemoral","valve_type":"balloon_expandable","gradient_post":8,"paravalvular_leak":false,"complications":0,"provider":"cr_001"},
  {"patient_id":"C15","visit_id":"cp_15","device_type":"dual_chamber","battery_voltage":2.85,"atrial_threshold":0.75,"ventricular_threshold":1.0,"atrial_pct_paced":80,"ventricular_pct_paced":5,"lead_status":"normal","provider":"cr_001"},
  {"patient_id":"C16","visit_id":"ci_16","battery_voltage":3.2,"shock_impedance":45,"detection_zone":200,"shocks_delivered":1,"atp_sequences":3,"episodes_treated":4,"inappropriate_shocks":false,"provider":"cr_001"},
  {"patient_id":"C17","assessment_id":"ac_17","cha2ds2_vasc":3,"has_bled":2,"anticoagulant":"apixaban","dose_mg":5,"inr":1.2,"time_in_range":85,"adherence":95,"provider":"cr_001"},
  {"patient_id":"C18","assessment_id":"lp_18","ldl":85,"hdl":45,"triglycerides":150,"lpa":35,"statin":true,"statin_dose":40,"pcsk9_inhibitor":false,"ldl_target_met":"yes","provider":"cr_001"},
  {"patient_id":"C19","assessment_id":"rh_19","sessions_completed":24,"sessions_target":36,"mets_improvement":2.5,"exercise_minutes_week":150,"bp_resting":125,"bp_exercise":150,"compliance":85,"completed":false,"provider":"cr_001"},
  {"patient_id":"C20","assessment_id":"as_20","peak_velocity":4.5,"mean_gradient":55,"aortic_valve_area":0.8,"dvi":0.25,"severity":"severe","ef":55,"symptoms":"dyspnea","provider":"cr_001"},
  {"patient_id":"C21","assessment_id":"mr_21","etiology":"primary","severity":"severe","vena_contracta":7,"regurg_volume":65,"regurg_fraction":55,"ef":60,"treatment":"teer","provider":"cr_001"},
  {"patient_id":"C22","assessment_id":"tr_22","tr_velocity":3.5,"right_ventricle_size":45,"tapse":15,"ivc_diameter":25,"severity":"severe","treatment":1,"provider":"cr_001"},
  {"patient_id":"C23","procedure_id":"vs_23","valve_type":"bioprosthetic","position":"aortic","approach":"open","pump_time":75,"complications":0,"hospital_days":7,"provider":"cr_001"},
  {"patient_id":"C24","assessment_id":"en_24","diagnosis":"definite","organism":"staph_aureus","blood_cultures_positive":3,"vegetation_size":12,"affected_valve":"mitral","surgery_needed":true,"treatment_duration_days":42,"provider":"cr_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');
