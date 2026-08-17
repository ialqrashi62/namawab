// filepath: gen_tier18.js
const fs = require('fs');

const routes = [
  [122, 'outbreak', 'outbreak_detect,outbreak_organism,outbreak_exposure,outbreak_response,outbreak_close'],
  [123, 'isolation', 'isolation_assess,isolation_ppe,isolation_room,isolation_signage,isolation_discontinue'],
  [124, 'mdro', 'mdro_screen,mdro_decolonize,mdro_antibiotic_steward,mdro_precautions,mdro_culture_followup'],
  [125, 'surveillance', 'infx_clabsi,infx_cauti,infx_ssi,infx_vap,infx_sir_calc'],
  [126, 'employee', 'employee_vaccination,employee_exposure,employee_fittest,employee_illness_exclusion,employee_tb_screen'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier18_infx_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier18_infx_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier18_infx_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['o_det','/api/infx_outbreak/outbreak_detect',{unit_id:'MICU',cases_count:5,baseline_count:1,days_window:7,pathogen:'mrsa',identical_strain:true,geo_link:3}],
  ['o_org','/api/infx_outbreak/outbreak_organism',{outbreak_id:'OB1',organism_type:'bacterial',organism:'c_difficile',antibiotic_resistance:false,affected_count:8,symptom_onset_hours:48,healthcare_associated:true}],
  ['o_exp','/api/infx_outbreak/outbreak_exposure',{outbreak_id:'OB1',exposure_type:'common_source',common_source_identified:true,exposure_source:'ward_5_food_tray',exposed_count:20,lab_confirmed_count:8,line_list_active:true}],
  ['o_resp','/api/infx_outbreak/outbreak_response',{outbreak_id:'OB1',ic_team_activated:true,administration_notified:true,public_health_notified:false,enhanced_surveillance:true,environmental_cultures_done:true,policies_reviewed:true,cases_recent_24h:3}],
  ['o_close','/api/infx_outbreak/outbreak_close',{outbreak_id:'OB1',days_since_last_case:21,attack_rate_pct:35,closure_status:'closed_controlled',total_cases:8,total_deaths:0}],

  ['i_assess','/api/infx_isolation/isolation_assess',{patient_id:'P1',pathogen_suspected:'tb_active',cough:true,fever:true,diarrhea:false,vesicular_rash:false,draining_wound:false,patient_setting:'private_room'}],
  ['i_ppe','/api/infx_isolation/isolation_ppe',{task_id:'T1',isolation_type:'airborne',gloves_worn:true,gown_worn:true,mask_worn:true,n95_worn:true,eye_protection_worn:true,hand_hygiene_before:true,hand_hygiene_after:true,compliance_score_pct:100}],
  ['i_room','/api/infx_isolation/isolation_room',{room_id:'R1',room_type:'airborne_aIIcu',pressure_pa:-15,ach:12,private_bathroom:true,dedicated_equipment:true,last_check_date:'within_7d'}],
  ['i_sign','/api/infx_isolation/isolation_signage',{room_id:'R1',sign_type:'airborne',sign_posted:true,door_closed:true,ppe_at_door:true,visitor_log_at_door:true,visitors_restricted:true}],
  ['i_disc','/api/infx_isolation/isolation_discontinue',{patient_id:'P1',discontinue_basis:'culture_based',days_since_positive:14,negative_test_result:true,symptom_resolution:true,antibiotic_course_completed:true}],

  ['m_scr','/api/infx_mdro/mdro_screen',{patient_id:'P1',mdro_type:'mrsa',prior_history:false,current_admission_screen_done:true,screen_day_of_admission:1,screen_site:'nares',screen_result:'positive'}],
  ['m_dec','/api/infx_mdro/mdro_decolonize',{patient_id:'P1',decolonization_protocol:'mupirocin_2pct_nasal',treatment_days:5,tolerated:true,follow_up_cultures_count:1,outcome:'cleared'}],
  ['m_stw','/api/infx_mdro/mdro_antibiotic_steward',{patient_id:'P1',mdro_type:'mrsa',appropriate_antibiotic_started:true,broad_spectrum_empiric:false,days_of_antibiotic:5,antibiotic:'vancomycin',de_escalation_done:true}],
  ['m_prec','/api/infx_mdro/mdro_precautions',{patient_id:'P1',private_room:true,cohorted:false,dedicated_equipment:true,mdro_type:'c_diff',contact_precautions:true,chlorhexidine_bathing:false}],
  ['m_fu','/api/infx_mdro/mdro_culture_followup',{patient_id:'P1',weekly_screens_count:2,mdro_type:'mrsa',days_since_first_positive:14,last_screen_status:'negative',consecutive_negatives:2}],

  ['s_clabsi','/api/infx_surveillance/infx_clabsi',{patient_id:'P1',central_line_days:120,event_type:'lcbi_1',blood_culture_positive_count:2,pathogen:'staph_aureus',days_line_in_place:10}],
  ['s_cauti','/api/infx_surveillance/infx_cauti',{patient_id:'P1',foley_days:6,event_type:'suti',indication_documented:true,foley_indication:'perioperative',urine_culture_count:120000,daily_review_removal:true}],
  ['s_ssi','/api/infx_surveillance/infx_ssi',{patient_id:'P1',ssi_class:'deep_incisional',days_post_surgery:14,wound_class:'clean_contaminated',purin_drainage:true,culture_positive:true,opened_by_surgeon:true}],
  ['s_vap','/api/infx_surveillance/infx_vap',{patient_id:'P1',ventilator_days:8,event_type:'pvap_2',temperature_max:38.5,wbc_min:14000,new_antibiotic:true,oxygenation:'worsening_30pct_fio2'}],
  ['s_sir','/api/infx_surveillance/infx_sir_calc',{unit_id:'MICU',hai_count:2,device_days:1500,patient_days:1200,hai_type:'clabsi',predicted_count:1.5}],

  ['e_vac','/api/infx_employee/employee_vaccination',{employee_id:'E1',vaccine_type:'flu',status:'current',doses_received:1,doses_required:1,decline_documented:'n_a_current',titer_proof:false}],
  ['e_exp','/api/infx_employee/employee_exposure',{exposure_id:'EX1',exposure_type:'bbv_needlestick',fluid_type:'blood',source_known:true,source_status:'hcv_positive',time_to_report_min:30,baseline_labs_done:true}],
  ['e_fit','/api/infx_employee/employee_fittest',{employee_id:'E1',respirator_type:'n95',fit_test_result:'quantitative_pass',last_fit_test_days:120,size:'medium',osha_1910_134_compliant:true}],
  ['e_excl','/api/infx_employee/employee_illness_exclusion',{employee_id:'E1',symptom:'fever',diagnosis:'influenza',direct_patient_care:true,days_symptomatic:3,clearance_status:'excluded',fever_free_24h:false}],
  ['e_tb','/api/infx_employee/employee_tb_screen',{employee_id:'E1',test_type:'igra_quantiferon',result:'negative',induration_mm:0,baseline_done:true,annual_done:true,symptoms_now:false,exposure_history:'none'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\infx_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_infx_tier18.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);