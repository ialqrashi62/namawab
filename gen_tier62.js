// filepath: gen_tier62.js
const fs = require('fs');

const routes = [
  [343, 'sp_geri', 'geriatric_assessment,polypharmacy_review,falls_clinic,delirium_screen,dementia_workup'],
  [344, 'sp_pall', 'palliative_intake,advance_directive,goals_of_care,comfort_care_order,end_of_life'],
  [345, 'sp_home', 'home_health_intake,home_health_visit,home_health_discharge,wound_care_visit,infusion_visit'],
  [346, 'sp_rehab', 'pt_evaluation,ot_evaluation,speech_eval,rehab_progress_note,rehab_discharge'],
  [347, 'sp_mat', 'maternity_intake,prenatal_visit,postnatal_visit,lactation_consult,high_risk_pregnancy'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier62_spec_care_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier62_spec_care_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier62_spec_care_ext_' + n + '_' + name + '_router.js', code);
  total++;
});

const smokeCases = [
  ['s_ga','/api/sp_geri/geriatric_assessment',{patient_id:'SG1','age':84,'cognition':'mmse_28','mobility':'walker','adl_score':5,'iadl_score':4,'functional_status':'partially_dependent','recommendation':'multidisciplinary_review','caregiver_present':true}],
  ['s_pr','/api/sp_geri/polypharmacy_review',{patient_id:'SG2','med_count':12,'beers_criteria_violations':2,'high_risk_meds':'benzo_opioid_anticholinergic','recommendation':'deprescribe_3','follow_up':14,'clinician_reviewed':true}],
  ['s_fc','/api/sp_geri/falls_clinic',{patient_id:'SG3','falls_count_6mo':3,'tug_score':18,'balance_berg':42,'home_safety_assessment':true,'vitamin_d_level':18,'recommendation':'pt_8_weeks_home_mods'}],
  ['s_ds','/api/sp_geri/delirium_screen',{patient_id:'SG4','cam_score':'positive','precipitants':'uti_post_op','severity':'moderate','workup':'labs_imaging_med_review','intervention':'non_pharm_first','follow_up':7}],
  ['s_dw','/api/sp_geri/dementia_workup',{patient_id:'SG5','moca_score':18,'mri_findings':'mild_atrophy','biomarkers':'csf_ab_tau_elevated','type':'alzheimer_mild','plan':'cholinesterase_inhibitor','caregiver_education':true}],
  ['s_pi','/api/sp_pall/palliative_intake',{patient_id:'SP1','reason':'cancer_pain','symptom_burden':'high','prognosis':'weeks_to_months','goals':'comfort_home','support_system':'family_present','referral_source':'oncology','needs_hospice_eval':true}],
  ['s_ad','/api/sp_pall/advance_directive',{patient_id:'SP2','ad_type':'living_will','completed':true,'durable_power_assigned':true,'healthcare_proxy':'daughter_name','witness':'attending_md','copy_in_ehr':true,'reviewed_at_admission':true}],
  ['s_gc','/api/sp_pall/goals_of_care',{patient_id:'SP3','discussion_type':'serious_illness','patient_values':'quality_over_quantity','resuscitation_status':'dnr_in_place','trial_period':'time_limited_trial','family_aligned':true,'follow_up':7}],
  ['s_co','/api/sp_pall/comfort_care_order',{patient_id:'SP4','symptom':'dyspnea','intervention':'morphine_syringe_pump','dose_mg':5,'frequency':'q4h_prn','non_pharm':'positioning_fan','effectiveness_reviewed':true,'nurse_acknowledged':true}],
  ['s_eol','/api/sp_pall/end_of_life',{patient_id:'SP5','phase':'actively_dying','comfort_measures':'morphine_lorazepam','family_present':true,'spiritual_care':'chaplain_visited','legacy_work':'memory_book','bereavement_follow_up':true}],
  ['s_hhi','/api/sp_home/home_health_intake',{patient_id:'SH1','referral_source':'hospital_discharge','skilled_needs':'wound_care','homebound':true,'caregiver_availability':'spouse_24_7','environment_safe':true,'initial_visit_48h':true,'plan_of_care':'drafted'}],
  ['s_hhv','/api/sp_home/home_health_visit',{patient_id:'SH2','visit_type':'skilled_nursing','vitals_taken':true,'wound_assessed':true,'medication_reviewed':true,'patient_education':true,'next_visit_eta':'2026-03-05','travel_time_min':35}],
  ['s_hhd','/api/sp_home/home_health_discharge',{patient_id:'SH3','length_of_service_days':45,'outcomes':'goals_met','patient_status':'improved','discharge_reason':'goals_met','follow_up_pcp_2w':true,'patient_satisfied':true}],
  ['s_wcv','/api/sp_home/wound_care_visit',{patient_id:'SH4','wound_type':'surgical_diabetic','stage':'stage_3','size_cm':4.5,'exudate':'moderate','dressing_changed':true,'healing_progress':'improving','patient_compliance':true}],
  ['s_iv','/api/sp_home/infusion_visit',{patient_id:'SH5','medication':'vancomycin','dose_mg':1000,'frequency':'q12h','line_type':'picc','line_care':'dressing_site_change','labs_drawn':true,'reaction_observed':false,'next_dose_due':'2026-03-04_18:00'}],
  ['s_pte','/api/sp_rehab/pt_evaluation',{patient_id:'SR1','reason':'post_hip_replacement','rom':'restricted','strength':'3_5','gait':'antalgic_limited','balance':'fair','pain_score':5,'goals':'independent_ambulation','plan':'3x_week_x_6wks'}],
  ['s_ote','/api/sp_rehab/ot_evaluation',{patient_id:'SR2','reason':'post_stroke','adl_score':45,'fine_motor':'impaired','sensory':'left_side_neglect','cognitive_screen':'lighthouse','goals':'upper_extremity_function','plan':'5x_week_x_4wks'}],
  ['s_ste','/api/sp_rehab/speech_eval',{patient_id:'SR3','reason':'dysphagia_post_stroke','swallow_screen':'failed','modified_barium_swallow':'aspiration_thin','language':'expressive_apraxia','recommendation':'npo_ng_tube','plan':'speech_3x_week'}],
  ['s_rpn','/api/sp_rehab/rehab_progress_note',{patient_id:'SR4','week_number':4,'goals_progress':'70_pct','barriers':'pain_fatigue','next_week_plan':'progress_resistance','patient_engagement':'high','discharge_estimated':2}],
  ['s_rdh','/api/sp_rehab/rehab_discharge',{patient_id:'SR5','discharge_reason':'goals_met','functional_improvement':'40_pct','home_program':'provided','follow_up_pcp':true,'equipment_ordered':'walker','patient_satisfaction':5}],
  ['s_mi','/api/sp_mat/maternity_intake',{patient_id:'SM1','gravida':2,'para':1,'ga_weeks':18,'edd_calc':'2026-09-15','blood_type':'o_pos','antibody_screen':'negative','risk_factors':'previous_csection','plan':'routine_prenatal'}],
  ['s_pv','/api/sp_mat/prenatal_visit',{patient_id:'SM2','ga_weeks':28,'bp':'120_78','weight_kg':72,'fhr':140,'fundal_height':28,'edema':'trace','urine_protein':'negative','recommendation':'continue_routine','next_visit':'4_weeks'}],
  ['s_pnv','/api/sp_mat/postnatal_visit',{patient_id:'SM3','days_postpartum':7,'delivery_method':'vaginal','perineum_healing':'normal','lochia':'normal','breastfeeding':'successful','mood_screen':4,'plan':'continue_follow_up'}],
  ['s_lc','/api/sp_mat/lactation_consult',{patient_id:'SM4','feeding_method':'breast','latch_quality':'good','milk_supply':'adequate','nipple_pain':'mild','baby_weight_gain':'adequate','plan':'continue_lactation','follow_up_2w':true}],
  ['s_hrp','/api/sp_mat/high_risk_pregnancy',{patient_id:'SM5','condition':'gestational_diabetes','ga_dx_weeks':24,'glucose_target':'fasting_95','treatment':'diet_metformin','fetal_growth':'normal','monitoring_plan':'weekly_nst','delivery_planning':'39_weeks_induce'}],
];

let sh = '#!/bin/bash\nH=http://127.0.0.1:3000\nP=0;F=0\n';
smokeCases.forEach(([nm, ep, body], i) => {
  fs.writeFileSync(`C:/tmp/spec_body_${i}.json`, JSON.stringify(body));
  sh += `C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_${i}.json "$H${ep}")\nif [ "$C" = "200" ]; then echo "OK ${nm}"; P=$((P+1)); else echo "FAIL ${nm} ($C)"; fi\n`;
});
sh += 'echo PASS=$P FAIL=$F\n';
fs.writeFileSync('sm_spec_tier62.sh', sh);
console.log('Created', total, 'routers');
console.log('Smoke cases:', smokeCases.length);
