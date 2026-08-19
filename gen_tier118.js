// filepath: gen_tier118.js
const fs = require('fs');
const mounts = [
  { mount: '/api/patient_exp_v2', engine: 'tier118_patient_experience_620_engine', fns: ['patient_feedback','complaint_tracking','patient_advocate','patient_education','family_communication'] },
  { mount: '/api/volunteer_v2', engine: 'tier118_volunteer_services_621_engine', fns: ['volunteer_assignment','volunteer_hours','gift_shop','chaplain_visit','wayfinding_assist'] },
  { mount: '/api/social_v2', engine: 'tier118_social_services_622_engine', fns: ['psychosocial_assessment','discharge_planning_social','abuse_screening','financial_counseling','community_resource'] },
  { mount: '/api/interpreter_v2', engine: 'tier118_interpreter_623_engine', fns: ['interpreter_request','translation_document','health_literacy','cultural_assessment','patient_navigator'] },
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
  {"patient_id":"W0","feedback_id":"pf_0","feedback_type":"survey","satisfaction_score":9,"nps_score":9,"comments":"excellent care","follow_up_required":false,"provider":"px_001"},
  {"patient_id":"W1","complaint_id":"ct_1","complaint_category":"wait_time","severity":"medium","description":"long wait in ED","status":"investigating","resolution_days":5,"provider":"px_001"},
  {"patient_id":"W2","advocate_id":"pa_2","concern_type":"communication","advocate_name":"sara_ahmed","contact_duration_min":20,"issue_resolved":true,"referral_made":"social_work","provider":"px_001"},
  {"patient_id":"W3","education_id":"pe_3","topic":"diabetes_self_care","method":"video","comprehension_verified":true,"duration_min":30,"provider":"rn_001"},
  {"patient_id":"W4","comm_id":"fc_4","family_member_id":"fm_001","relationship":"spouse","update_type":"condition_change","consent_documented":true,"provider":"md_001"},
  {"patient_id":"W5","assignment_id":"va_5","volunteer_id":"v_001","task":"patient_companion","location":"waiting_room","duration_min":60,"completed":true,"provider":"vs_001"},
  {"patient_id":"W6","hours_id":"vh_6","volunteer_id":"v_001","shift_date":"2026-09-01","hours_logged":4,"department":"er","provider":"vs_001"},
  {"patient_id":"W7","transaction_id":"gs_7","item":"flowers","amount_dollars":25,"payment_method":"card","provider":"vs_001"},
  {"patient_id":"W8","visit_id":"cv_8","chaplain_id":"ch_001","faith_tradition":"muslim","visit_type":"spiritual_support","duration_min":30,"provider":"ch_001"},
  {"patient_id":"W9","assist_id":"wa_9","from_location":"lobby","to_location":"radiology","assistance_type":"wheelchair","duration_min":15,"provider":"vs_001"},
  {"patient_id":"W10","assessment_id":"ps_10","social_worker_id":"sw_001","living_situation":"alone","support_system":"moderate","safety_concern":false,"provider":"sw_001"},
  {"patient_id":"W11","plan_id":"dp_11","discharge_destination":"home_health","services_arranged":true,"follow_up_visits_planned":3,"provider":"sw_001"},
  {"patient_id":"W12","screening_id":"as_12","abuse_type":"none","reported_to_authorities":false,"safety_plan":"n/a","provider":"sw_001"},
  {"patient_id":"W13","counseling_id":"fc_13","counseling_type":"charity_care","application_submitted":true,"estimated_savings_dollars":5000,"provider":"fc_001"},
  {"patient_id":"W14","resource_id":"cr_14","resource_type":"food_assistance","agency_name":"red_cross","contact_made":true,"provider":"sw_001"},
  {"patient_id":"W15","request_id":"ir_15","language":"arabic","service_type":"in_person","duration_min":45,"provider":"int_001"},
  {"patient_id":"W16","translation_id":"td_16","document_type":"consent_form","target_language":"arabic","patient_received_copy":true,"provider":"int_001"},
  {"patient_id":"W17","assessment_id":"hl_17","reading_level":6,"comprehension_score":85,"teach_back_passed":true,"provider":"rn_001"},
  {"patient_id":"W18","assessment_id":"ca_18","cultural_background":"arab","beliefs_relevant":"ramadan_fasting","care_plan_adjusted":true,"provider":"md_001"},
  {"patient_id":"W19","nav_id":"pn_19","navigator_id":"nav_001","barriers_identified":3,"referrals_made":2,"outcome":"navigated","provider":"nav_001"}
];
for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:\\tmp\\multi_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log('Wrote 20 bodies and 4 routers');