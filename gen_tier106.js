// filepath: gen_tier106.js
const fs = require('fs');
const mounts = [
  { mount: '/api/er_ext_v2', engine: 'tier106_er_extended_555_engine', fns: ['triage_protocol','fast_track','critical_care','observation','discharge_planning'] },
  { mount: '/api/trauma_center_v2', engine: 'tier106_trauma_center_556_engine', fns: ['trauma_team_activation','massive_transfusion','damage_control_surgery','icu_admission','rehab_referral'] },
  { mount: '/api/disaster_v2', engine: 'tier106_disaster_557_engine', fns: ['incident_command','triage_disaster','resource_surge','decontamination','evacuation'] },
  { mount: '/api/poison_control_v2', engine: 'tier106_poison_control_558_engine', fns: ['exposure_assessment','antidote_administration','observation_period','follow_up_call','toxicology_screen'] },
  { mount: '/api/pre_hospital_v2', engine: 'tier106_pre_hospital_559_engine', fns: ['ems_dispatch','field_triage','transport_decision','pre_hospital_care','handover'] },
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
  {"patient_id":"E0","triage_id":"tr_0","acuity_level":3,"esi_level":2,"chief_complaint":"chest_pain","vital_score":7,"wait_min":10,"provider":"er_001"},
  {"patient_id":"E1","fasttrack_id":"ft_1","eligibility":true,"chief_complaint":"minor_laceration","treatment_min":45,"disposition":"discharged","satisfaction":9,"provider":"er_001"},
  {"patient_id":"E2","episode_id":"cc_2","acuity":1,"presenting":"cardiac_arrest","interventions":5,"response_minutes":3,"outcome":"stabilized","provider":"er_001"},
  {"patient_id":"E3","episode_id":"ob_3","observation_hours":12,"reason":"chest_pain","tests_ordered":3,"disposition":"discharged","readmission_30d":false,"provider":"er_001"},
  {"patient_id":"E4","plan_id":"dp_4","patient_id":"E4","social_risk_score":3,"follow_up_appointment":2,"home_care_needed":true,"barriers_count":2,"provider":"er_001"},
  {"patient_id":"E5","activation_id":"ta_5","level":1,"trauma_type":"blunt","team_size":8,"response_min":3,"activation_time":"2026-09-01T14:30:00Z","provider":"tr_001"},
  {"patient_id":"E6","protocol_id":"mt_6","activation":"massive","units_packed_rbc":10,"plasma_units":6,"platelet_units":2,"ratio":"1:1:1","provider":"tr_001"},
  {"patient_id":"E7","procedure_id":"ds_7","indication":"hemodynamic_instability","procedure":"laparotomy","time_minutes":45,"blood_loss_ml":2000,"icu_admission":true,"provider":"tr_001"},
  {"patient_id":"E8","admission_id":"ic_8","mechanism":"mvc","injury_severity_score":25,"ventilator_days":5,"complications":1,"outcome":"survived","provider":"tr_001"},
  {"patient_id":"E9","referral_id":"rh_9","patient_id":"E9","referral_type":"physical_therapy","days_to_rehab":7,"functional_independence_measure":85,"discharge_destination":"home","provider":"tr_001"},
  {"patient_id":"E10","incident_id":"ic_10","command_structure_activated":true,"personnel_count":25,"communication_channels":3,"response_minutes":10,"status":"contained","provider":"dm_001"},
  {"patient_id":"E11","triage_id":"td_11","incident_id":"ic_10","tag_color":"red","victim_count":15,"category":"mass_casualty","treatment_zone":"primary","provider":"dm_001"},
  {"patient_id":"E12","surge_id":"rs_12","resource_type":"bed","additional_units":30,"staff_called_in":45,"supplies_days":7,"hospital_capacity_pct":85,"provider":"dm_001"},
  {"patient_id":"E13","decon_id":"de_13","contamination_type":"chemical","victims_processed":25,"decon_minutes":45,"efficacy":"complete","provider":"dm_001"},
  {"patient_id":"E14","plan_id":"ev_14","zone":"3","evacuees":150,"destination":"alt_site","transport_minutes":60,"special_needs_count":12,"provider":"dm_001"},
  {"patient_id":"E15","case_id":"ea_15","substance":"acetaminophen","dose_mg":7500,"weight_kg":70,"time_to_call":120,"severity":"moderate","provider":"pc_001"},
  {"patient_id":"E16","treatment_id":"aa_16","antidote":"n_acetylcysteine","dose_mg":150,"route":"iv","reactions":0,"effectiveness":"complete","provider":"pc_001"},
  {"patient_id":"E17","period_id":"op_17","substance":"benzodiazepine","duration_hours":6,"monitoring":"cardiac","symptoms":0,"disposition":"discharged","provider":"pc_001"},
  {"patient_id":"E18","call_id":"fu_18","case_id":"ea_15","time_hours":24,"status":"stable","symptoms":0,"adherence":1,"outcome":"resolved","provider":"pc_001"},
  {"patient_id":"E19","order_id":"ts_19","panel":"comprehensive_drug","results_count":15,"abnormal_count":2,"critical_values":0,"turnaround_hours":2,"provider":"pc_001"},
  {"patient_id":"E20","dispatch_id":"em_20","priority":1,"unit_id":"amb_5","response_min":5,"transport_min":10,"on_scene_min":15,"provider":"ph_001"},
  {"patient_id":"E21","triage_id":"ft_21","protocol":"cdc_field","acuity":"yellow","vital_signs_score":3,"interventions_count":2,"transport_decision":"emergent","provider":"ph_001"},
  {"patient_id":"E22","decision_id":"tr_22","distance_km":25,"traffic_min":18,"weather":"clear","air_vs_ground":"ground","justification":"closest","provider":"ph_001"},
  {"patient_id":"E23","care_id":"pc_23","iv_access":true,"medications_given":2,"airway_management":"bvm","cardiac_monitor":true,"interventions_count":5,"provider":"ph_001"},
  {"patient_id":"E24","handover_id":"ho_24","ems_to_ed":true,"verbal_report_min":2,"documentation_complete":true,"vitals_communicated":true,"time_to_provider":3,"provider":"ph_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 25 bodies and 5 routers');