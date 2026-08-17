// filepath: gen_tier27.js
const fs = require('fs');

const routes = [
  [168, 'triage', 'esi,chief_complaint,vitals_early_warning,disposition,chief_complaint_v2'],
  [169, 'resuscitation', 'acls,sepsis_bundle,stroke_alert,massive_transfusion,code_blue'],
  [170, 'trauma', 'trauma_activation,iss_score,mechanism,secondary_survey,transfer_trauma'],
  [171, 'toxicology', 'toxidrome,antidote,ingest,withdrawal,envenomation'],
  [172, 'ems', 'dispatch,handoff,telemetry,transport_mode,documentation_ems'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier27_emergency_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier27_emergency_ext_${n}_${name}_engine');
const eps = [${epsArr}];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
`;
  fs.writeFileSync('tier27_emergency_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['e_esi','/api/ed_triage/esi',{encounter_id:'ED1',hr:90,sbp:130,dbp:80,spo2:96,rr:18,temp_c:37,pain_score:4,acuity:'esi_3_urgent',immediate_life_threat:false,high_risk:false}],
  ['e_cc','/api/ed_triage/chief_complaint',{encounter_id:'ED1',complaint:'chest_pain',onset:'sudden',duration_hours:2,associated_trauma:false,pain_score:7}],
  ['e_ews','/api/ed_triage/vitals_early_warning',{assessment_id:'A1',hr:95,sbp:115,rr:18,spo2:96,temp_c:37.5,consciousness_avpu:true,ews_score:'2'}],
  ['e_disp','/api/ed_triage/disposition',{encounter_id:'ED1',disposition:'admitted_ward',los_hours:6,acuity:'esi_3_urgent',return_72h:false,followup_arranged:true}],
  ['e_cc2','/api/ed_triage/chief_complaint_v2',{encounter_id:'ED2',complaint:'altered_mental',focal_neuro_deficit:false,glucose_mg_dl:85,meningismus:false}],

  ['e_acls','/api/ed_resus/acls',{episode_id:'R1',rhythm:'vf',cpr_started:true,epinephrine_doses:2,minutes_down:8,shockable:true,outcome:'rosc'}],
  ['e_sep','/api/ed_resus/sepsis_bundle',{episode_id:'R2',lactate:3.5,blood_culture_drawn:true,broad_spectrum_abx:true,fluid_bolus_ml:2500,vasopressor_needed:false,map:75}],
  ['e_stk','/api/ed_resus/stroke_alert',{episode_id:'R3',last_known_well_min:90,nihss:8,ct_done:true,cta_done:true,iv_thrombolytic_given:true,thrombectomy:false}],
  ['e_mtp','/api/ed_resus/massive_transfusion',{episode_id:'R4',blood_loss_ml:2000,hr:130,sbp:85,base_excess:-8,prbc_units:6,ffp_units:4,platelets_units:1}],
  ['e_cb','/api/ed_resus/code_blue',{event_id:'CB1',location:'ed',minutes_down:10,compressions_quality:true,defibrillation_count:2,outcome:'rosc'}],

  ['e_act','/api/ed_trauma/trauma_activation',{activation_id:'T1',criteria:'full_trauma_team',mechanism:'mvc_high_speed',penetrating:false,iss:18,sbp:100,intubated:false}],
  ['e_iss','/api/ed_trauma/iss_score',{assessment_id:'TA1',head_ais:4,face_ais:2,chest_ais:3,abdomen_ais:2,extremity_ais:2,external_ais:1}],
  ['e_mech','/api/ed_trauma/mechanism',{mechanism_id:'M1',type:'mvc_high_speed',restraint_used:true,helmet_used:false,energy_estimate:5,c_spine_clear:false}],
  ['e_sec','/api/ed_trauma/secondary_survey',{assessment_id:'TS1',head_exam:true,neck_exam:true,chest_exam:true,abdomen_exam:true,pelvis_exam:true,extremities_exam:true,back_exam:true,neuro_exam:true}],
  ['e_tx','/api/ed_trauma/transfer_trauma',{transfer_id:'TX1',verified_level:true,transfer_distance_km:50,ems_present:true,handoff_documented:true,records_sent:true}],

  ['e_txm','/api/ed_tox/toxidrome',{assessment_id:'TX1',toxidrome:'opioid',hr:60,temp_c:36.5,pupil_size_mm:1,muscle_tone:'flaccid',skin_dry:true}],
  ['e_ant','/api/ed_tox/antidote',{episode_id:'TX2',antidote:'naloxone',dose:2,doses_given:1,response:true,poison:'opioid'}],
  ['e_ing','/api/ed_tox/ingest',{ingest_id:'IG1',substance:'acetaminophen',amount:10,unit:'g',time_since_ingest_min:45,intentional:false,activated_charcoal:true}],
  ['e_wd','/api/ed_tox/withdrawal',{assessment_id:'WD1',substance:'alcohol',ciwa_ar_score:8,cows_score:0,benzodiazepine_given:false,protocol:'ciwa_ar'}],
  ['e_env','/api/ed_tox/envenomation',{episode_id:'EV1',type:'snake_crotalid',time_to_ed_min:60,antivenom_given:true,severity:'moderate',allergic_reaction:false}],

  ['e_dsp','/api/ed_ems/dispatch',{dispatch_id:'DSP1',priority:'echo_life_threat',response_time_min:6,unit:'als',first_responder:true,trauma_center_diversion:false}],
  ['e_hd','/api/ed_ems/handoff',{handoff_id:'HO1',sbar_used:true,chief_complaint:'chest_pain',allergies_communicated:true,medications_communicated:true,code_status_communicated:true,vitals_communicated:true}],
  ['e_tel','/api/ed_ems/telemetry',{session_id:'TL1',ecg_transmitted:true,distance_km:30,med_consult:true,activation:false,hospital_prenotified:false}],
  ['e_tm','/api/ed_ems/transport_mode',{transport_id:'TM1',mode:'ground_als',distance_km:80,acuity:'critical',ventilator_required:false,iv_required:true}],
  ['e_doc','/api/ed_ems/documentation_ems',{run_id:'RN1',vitals_recorded:true,interventions_recorded:true,timeline_documented:true,signature_obtained:true,handoff_signed:true}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\em_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_emergency_tier27.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);