// filepath: gen_tier85.js
const fs = require('fs');
const path = require('path');

const mods = [
  { name: 'pain_acute', eng: 448, base: 0,
    eps: ['acute_pain','ed_pain','trauma_pain','cancer_pain','post_op_pain_titrated'] },
  { name: 'pain_chronic', eng: 449, base: 5,
    eps: ['chronic_pain','opioid_chronic','pain_clinic','neuropathic_pain','interventional_pain'] },
  { name: 'pain_procedures', eng: 450, base: 10,
    eps: ['epidural','rfa','surgical_implant','joint_injection','trigger_point'] },
  { name: 'pain_rehab', eng: 451, base: 15,
    eps: ['pt_ot','tens','biofeedback','work_hardening','functional_restoration'] },
  { name: 'pain_specialty', eng: 452, base: 20,
    eps: ['headache_pain','pelvic_pain','cancer_pain_specialty','pediatric_pain','pain_psych'] }
];

const bodies = [
  // 0 acute_pain
  {patient_id:'P0',visit_id:'pv_00',pain_score:8,duration_hours:12,location:'right_hip',associated:'fever',imaging_done:true,imaging_findings:'fracture',pain_management:'iv_opioids',ketorolac_given:true,opioid_mme_24h:60,response:'improving',provider:'pain_001',next_review:4},
  // 1 ed_pain
  {patient_id:'P1',visit_id:'pv_01',pain_score:7,location:'abdomen',duration_hours:6,etiology:'renal_colic',imaging_done:'ct',pain_management:'iv_opioids_android',opioid_mme_24h:40,response:'improving',complications:'none',disposition:'home',provider:'pain_001',next_review:8},
  // 2 trauma_pain
  {patient_id:'P2',visit_id:'pv_02',pain_score:9,injury_type:'mvc',severity_score:'iss_15',iss_score:15,location:'long_bone',opioid_consumed_mg:80,nerve_block_done:true,block_type:'fascia_iliaca',discharge_plan:'home_pain_clinic',provider:'pain_001',next_review:8},
  // 3 cancer_pain
  {patient_id:'P3',visit_id:'pv_03',cancer_stage:'iv',pain_score:7,pain_mechanism:'bone_metastasis',location:'spine',opioid_daily_mg:120,adjuvant:'gabapentin',radiation_consulted:true,complications:'constipation',recommendation:'increase_opioid',provider:'pain_001',next_review:7},
  // 4 post_op_pain_titrated
  {patient_id:'P4',visit_id:'pv_04',pain_score:5,postop_day:2,surgery_type:'abdominal_hysterectomy',pain_management:'pca',opioid_consumed_mg:30,side_effects_score:'mild',bowel_function:'none',mobilization:'tolerating',adjuvant:'acetaminophen',plan:'transition_oral',provider:'pain_001',next_review:12},
  // 5 chronic_pain
  {patient_id:'P5',visit_id:'pv_05',pain_type:'mixed',pain_score:7,duration_months:36,location:'low_back',oswestry_index:48,brief_pain_inventory:6,work_disability:true,treatment_plan:'multimodal',provider:'pain_001',next_review:30},
  // 6 opioid_chronic
  {patient_id:'P6',assessment_id:'pa_06',daily_mme:90,opioid_type:'oxycodone',daily_dose_mg:60,compliance:true,urine_drug_screen:true,pdmp_checked:true,taper_plan:'gradual',naloxone_prescribed:true,function_status:'improving',provider:'pain_001',next_review:30},
  // 7 pain_clinic
  {patient_id:'P7',visit_id:'pv_07',chief_complaint:'fibromyalgia',pain_score:7,duration_months:24,imaging_findings:'normal',peg_score:7,referral:'rheum',multimodal_approach:true,treatment_plan:'lyrica_exercise_cbt',provider:'pain_001',next_review:30},
  // 8 neuropathic_pain
  {patient_id:'P8',assessment_id:'pa_08',diagnosis:'diabetic_peripheral',douleur_neuropathic_score:6,pain_score:7,allodynia_present:2,first_line:'gabapentin',responded_to_first:true,second_line:'none',provider:'pain_001',next_review:30},
  // 9 interventional_pain
  {patient_id:'P9',assessment_id:'pa_09',procedure_type:'epidural',target_level:'l5_s1',indication:'radiculopathy',imaging_guidance:true,sedation:true,operative_time_min:30,complications:'none',pain_reduction_pct:75,duration_weeks:12,provider:'pain_001',next_review:30},
  // 10 epidural (procedures)
  {patient_id:'P10',procedure_id:'pp_10',side:'right',levels:2,imaging_guidance:true,steroid:'triamcinolone',local_anesthetic:'bupivacaine',steroid_dose_mg:80,response_pct:80,duration_weeks:8,complications:'none',recommendation:'repeat_4wks',provider:'pain_001',next_review:30},
  // 11 rfa
  {patient_id:'P11',procedure_id:'pp_11',modality:'radiofrequency',target:'medial_branch',lesion_count:4,temperature_c:80,duration_sec:60,procedure_time_min:45,response_pct:90,complications:'none',follow_up_weeks:8,provider:'pain_001',next_review:60},
  // 12 surgical_implant
  {patient_id:'P12',surgery_id:'ps_12',device_type:'spinal_cord_stim',brand:'medtronic',indication:'fbss',stage:'trial_then_implant',trial_success:true,complications:'none',trial_duration_weeks:2,follow_up_weeks:8,recommendation:'permanent_implant',provider:'pain_001',next_review:30},
  // 13 joint_injection
  {patient_id:'P13',procedure_id:'pp_13',joint:'knee',medication:'triamcinolone',dose_mg:40,imaging_guidance:true,approach:'lateral',complications:'none',response_pct:80,duration_weeks:8,follow_up_weeks:8,recommendation:'repeat_3mo',provider:'pain_001',next_review:90},
  // 14 trigger_point
  {patient_id:'P14',procedure_id:'pp_14',region:'trapezius',trigger_point_count:3,medication:'lidocaine_1pct',volume_ml:3,response_pct:90,complications:'none',duration_weeks:4,follow_up_weeks:8,sessions_completed:2,provider:'pain_001',next_review:30},
  // 15 pt_ot
  {patient_id:'P15',visit_id:'pv_15',discipline:'pt',sessions_per_week:2,session_duration_min:45,exercise_type:'strengthening',home_program_compliance:80,progress_score:60,functional_goals:'independ_walk_30m',pain_score:6,discharge_plan:'continue_then_dc',provider:'pt_001',next_review:30},
  // 16 tens
  {patient_id:'P16',visit_id:'pv_16',frequency_hz:80,pulse_width_us:200,electrode_placement:'paraspinal',session_duration_min:30,sessions_per_week:5,pain_reduction_pct:40,sleep_improvement:true,medication_reduction:true,complications:'none',provider:'pain_001',next_review:30},
  // 17 biofeedback
  {patient_id:'P17',visit_id:'pv_17',modality:'emg',sessions_completed:6,stress_reduction_score:7,muscle_tension_reduction:30,anxiety_score:5,home_practice_compliance:80,pain_reduction_pct:35,follow_up_weeks:4,provider:'pain_001',next_review:30},
  // 18 work_hardening
  {patient_id:'P18',visit_id:'pv_18',program_duration_weeks:4,weekly_hours:20,physical_capacity_score:65,functional_capacity_score:70,return_to_work_plan:'modified_duty',job_match_score:80,discharge_recommendation:'rtw',follow_up_weeks:8,provider:'pain_001',next_review:30},
  // 19 functional_restoration
  {patient_id:'P19',visit_id:'pv_19',program:'intensive',program_duration_weeks:6,weekly_hours:30,initial_function:40,final_function:75,pain_score_change:5,return_to_work_pct:80,discharge_plan:'rtw_full_duty',complications:'none',provider:'pain_001',next_review:30},
  // 20 headache_pain
  {patient_id:'P20',assessment_id:'pa_20',headache_type:'migraine',headache_days_month:15,allodynia:false,aura_present:false,abortive_med:'sumatriptan',preventive_med:'topiramate',botox_started:true,cgrp_started:false,pain_score:7,provider:'pain_001',next_review:30},
  // 21 pelvic_pain
  {patient_id:'P21',assessment_id:'pa_21',pelvic_pain_type:'menstrual',pain_duration_months:18,depression_comorbid:true,endometriosis_confirmed:true,dyspareunia:true,imaging:'mri',treatment:'multimodal',reproductive_referral:true,pain_reduction_pct:50,provider:'pain_001',next_review:30},
  // 22 cancer_pain_specialty
  {patient_id:'P22',assessment_id:'pa_22',cancer_pain_type:'mixed',cancer_stage:'iv',neuropathic_component:true,bone_metastasis:true,visceral_component:true,current_mme:180,rotation_done:true,nerve_block_consulted:true,intrathecal_pump_consulted:true,palliative_care_consulted:true,provider:'pain_001',next_review:14},
  // 23 pediatric_pain
  {patient_id:'P23',visit_id:'pv_23',age_years:10,pain_score:6,duration_days:30,school_days_missed:5,sleep_disrupted:true,functional_impact_score:7,cognitive_behavioral_done:true,parent_coaching_done:true,medication_used:'tylenol',response:'moderate',provider:'pain_001',next_review:14},
  // 24 pain_psych
  {patient_id:'P24',visit_id:'pv_24',pain_duration_years:5,catastrophizing_score:30,kinesiophobia_score:25,acceptance_score:35,depression_score:8,anxiety_score:10,cbt_completed:8,sessions_remaining:12,plan:'cbt_then_act',medication_management:'coordinated',provider:'pain_001',next_review:14}
];

for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:/tmp/pain_body_${i}.json`, JSON.stringify(bodies[i]));
}
for (const m of mods) {
  const router = `// filepath: tier85_pain_ext_${m.eng}_${m.name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier85_pain_ext_${m.eng}_${m.name}_engine');
const eps = ['${m.eps.join("','")}'];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
`;
  fs.writeFileSync(path.join(__dirname, `tier85_pain_ext_${m.eng}_${m.name}_router.js`), router);
}
console.log(`Wrote ${bodies.length} bodies and ${mods.length} routers`);
