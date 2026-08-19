// filepath: gen_tier76.js
const fs = require('fs');

const routes = [
  [403, 'endo_diabetes', 'diabetes_initial,diabetes_followup,diabetes_insulin_pump,diabetes_cgm,diabetes_complications'],
  [404, 'endo_thyroid', 'thyroid_assessment,thyroid_ultrasound,thyroid_biopsy,thyroid_cancer,thyroid_eye_disease'],
  [405, 'endo_adrenal', 'adrenal_incidentaloma,adrenal_workup,adrenal_surgery,cushings_workup,adrenal_insufficiency'],
  [406, 'endo_pituitary', 'pituitary_incidentaloma,pituitary_function,prolactinoma,acromegaly,pituitary_surgery'],
  [407, 'endo_special', 'bone_metabolic,osteoporosis,calcium_disorder,lipid_specialist,pc_os'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier76_endo_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier76_endo_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier76_endo_ext_' + n + '_' + name + '_router.js', code);
  total++;
});

const smokeCases = [
  ['e_di','/api/endo_diabetes/diabetes_initial',{patient_id:'EN1','visit_id':'di_001','diabetes_type':'type2','a1c':7.5,'fasting_glucose':140,'bmi':32,'bp':'140_85','egfr':85,'ldl':110,'duration_years':5,'medications':'metformin_1000mg','family_history':'positive','provider':'endo_001','next_review':7}],
  ['e_df','/api/endo_diabetes/diabetes_followup',{patient_id:'EN2','visit_id':'df_001','a1c':7.1,'a1c_change':-0.4,'fasting_glucose':130,'weight_change_kg':-2,'medication_adherence':0.85,'hypoglycemia_count':0,'complications_screened':true,'eye_exam_done':true,'foot_exam_done':true,'provider':'endo_001','next_review':7}],
  ['e_dip','/api/endo_diabetes/diabetes_insulin_pump',{patient_id:'EN3','pump_id':'dip_001','pump_model':'medtronic_670g','start_date':'2026-08-15','basal_rate_units_hr':36,'carb_ratio':10,'correction_factor':50,'time_in_range_pct':68,'cgm_data_reviewed':true,'provider':'endo_001','next_review':14}],
  ['e_dcgm','/api/endo_diabetes/diabetes_cgm',{patient_id:'EN4','cgm_id':'dcgm_001','cgm_model':'dexcom_g6','start_date':'2026-07-15','time_in_range_pct':70,'time_above_180_pct':8,'time_below_70_pct':3,'glucose_variability_cv':34,'alerts_set':true,'provider':'endo_001','next_review':14,'sensor_change_due':7}],
  ['e_dc','/api/endo_diabetes/diabetes_complications',{patient_id:'EN5','assessment_id':'dc_001','retinopathy_present':false,'neuropathy_present':true,'nephropathy_stage':'g1','foot_exam_normal':false,'egfr':75,'acr':30,'macrovascular':'cad','provider':'endo_001','next_review':14,'referral':'nephrology'}],
  ['e_ta','/api/endo_thyroid/thyroid_assessment',{patient_id:'EN6','assessment_id':'ta_001','tsh':1.8,'free_t4':1.2,'free_t3':3.4,'symptoms':'fatigue','thyroid_exam':'enlarged','antibody_tests':true,'imaging_ordered':'us','medication_history':'none','family_history':'hypothyroidism','provider':'endo_002','next_review':7}],
  ['e_tu','/api/endo_thyroid/thyroid_ultrasound',{patient_id:'EN7','study_id':'tu_001','ti_rads_score':3,'nodule_size_cm':1.2,'nodule_count':2,'laterality':'right','echogenicity':'hypoechoic','calcifications_present':false,'vascularity':'low','recommendation':'follow_up_6_months','provider':'rad_endo_001','next_review':7}],
  ['e_tb','/api/endo_thyroid/thyroid_biopsy',{patient_id:'EN8','procedure_id':'tb_001','biopsy_type':'fnc','nodule_targeted':'right_upper','samples_collected':4,'complications':'none','cytology_result':'bethesda_3','recommended_followup':'repeat_fnc_3_months','provider':'endo_001','next_review':7}],
  ['e_tc','/api/endo_thyroid/thyroid_cancer',{patient_id:'EN9','cancer_id':'tc_001','cancer_type':'papillary','stage':'T1N0M0','treatment':'total_thyroidectomy','rai_required':false,'tsh_suppression_active':true,'thyroglobulin_trending':'declining','recurrence_risk':'low','provider':'endo_001','next_review':7}],
  ['e_te','/api/endo_thyroid/thyroid_eye_disease',{patient_id:'EN10','assessment_id':'te_001','cas_score':3,'eyelid_retraction':false,'proptosis_mm':22,'diplopia_present':true,'optic_nerve_involvement':false,'disease_activity':'active','iv_steroid_considered':true,'provider':'oph_001','next_review':7}],
  ['e_ai','/api/endo_adrenal/adrenal_incidentaloma',{patient_id:'EN11','finding_id':'ai_001','size_cm':2.5,'imaging_characteristics':'lipid_rich','hormonal_workup_complete':true,'pheochromocytoma_ruled_out':true,'aldosterone_renin_ratio':18,'cortisol_post_dex_suppression':0.9,'recommendation':'imaging_followup','provider':'endo_001','next_review':7}],
  ['e_aw','/api/endo_adrenal/adrenal_workup',{patient_id:'EN12','workup_id':'aw_001','symptoms':'hypertension_palpitations','plasma_metanephrines':45,'24h_urine_metanephrines':300,'aldosterone_plasma':12,'plasma_renin':1.5,'cortisol_am':18,'dex_suppression_test':1.2,'provider':'endo_001','next_review':7}],
  ['e_as','/api/endo_adrenal/adrenal_surgery',{patient_id:'EN13','surgery_id':'as_001','procedure':'laparoscopic_adrenalectomy','side':'right','indication':'functional_adenoma','surgical_approach':'laparoscopic','operative_time_min':120,'complications':'none','hospital_stay_days':2,'provider':'surgeon_001','post_op_followup':7}],
  ['e_cw','/api/endo_adrenal/cushings_workup',{patient_id:'EN14','workup_id':'cw_001','suspicion':'medication_induced','late_night_salivary_cortisol':4.5,'dex_suppression_test':0.8,'acth_level':15,'imaging_ordered':'pituitary_mri','exogenous_steroid_history':'on_prednisone','provider':'endo_001','next_review':7}],
  ['e_ai2','/api/endo_adrenal/adrenal_insufficiency',{patient_id:'EN15','assessment_id':'ai_001','am_cortisol':3.5,'acth_stimulation_test':12,'duration_years':5,'current_meds':'hydrocortisone_15mg','stress_dose_reviewed':true,'emergency_injection_prescribed':true,'provider':'endo_001','next_review':7}],
  ['e_pi','/api/endo_pituitary/pituitary_incidentaloma',{patient_id:'EN16','finding_id':'pi_001','size_mm':7,'imaging_type':'mri','hormonal_workup_complete':true,'prolactin':15,'igf1':180,'tsh':1.2,'acth':20,'visual_field_defect':false,'recommendation':'imaging_followup','provider':'endo_001','next_review':7}],
  ['e_pf','/api/endo_pituitary/pituitary_function',{patient_id:'EN17','assessment_id':'pf_001','prolactin':15,'igf1':180,'tsh':1.2,'acth':20,'cortisol_am':18,'fsh':5,'lh':4,'test_type':'full_pituitary','menstrual_irregularity':false,'provider':'endo_001','next_review':7}],
  ['e_pa','/api/endo_pituitary/prolactinoma',{patient_id:'EN18','assessment_id':'pa_001','prolactin_level':85,'tumor_size_mm':6,'treatment':'cabergoline','responsive_to_dopamine_agonist':true,'visual_field_defect':false,'bromocriptine_tried':true,'provider':'endo_001','next_review':7}],
  ['e_ac','/api/endo_pituitary/acromegaly',{patient_id:'EN19','assessment_id':'ac_001','igf1_level':650,'gh_suppression_test':'failed','tumor_size_mm':15,'surgical_intervention_planned':true,'pre_op_oct_rehab':true,'cardiac_screening':'ecg_echo','provider':'endo_001','next_review':7}],
  ['e_ps','/api/endo_pituitary/pituitary_surgery',{patient_id:'EN20','surgery_id':'ps_001','approach':'endoscopic_transsphenoidal','resection_complete':true,'csf_leak_post_op':false,'diabetes_insipidus_temporary':true,'complications':'none','hospital_stay_days':4,'provider':'ns_001','next_review':7}],
  ['e_bm','/api/endo_special/bone_metabolic',{patient_id:'EN21','assessment_id':'bm_001','vitamin_d_25':15,'pth':75,'calcium':8.8,'phosphorus':3.2,'renal_function':'normal','medications':'cholecalciferol_2000','risk_factors':'low_sun_exposure','provider':'endo_001','next_review':7}],
  ['e_op','/api/endo_special/osteoporosis',{patient_id:'EN22','assessment_id':'op_001','dexa_t_score':-2.5,'fracture_history':'wrist','treatment':'bisphosphonate','frax_score_10y':18,'recommendation':'continue_treatment','refracture_risk':'moderate','provider':'endo_001','next_review':7}],
  ['e_cd','/api/endo_special/calcium_disorder',{patient_id:'EN23','assessment_id':'cd_001','calcium_total':10.5,'pth':60,'vitamin_d_25':32,'24h_urine_calcium':280,'primary_hyperparathyroidism_evaluation':true,'sesta_mibi_planned':true,'provider':'endo_001','next_review':7}],
  ['e_ls','/api/endo_special/lipid_specialist',{patient_id:'EN24','assessment_id':'ls_001','ldl':140,'hdl':38,'triglycerides':220,'lp_a':45,'apob':120,'lipid_disorders_thought':'familial_hypercholesterolemia','genetic_test_ordered':true,'provider':'endo_001','next_review':7}],
  ['e_pcos','/api/endo_special/pc_os',{patient_id:'EN25','assessment_id':'pcos_001','rotterdam_criteria_met':3,'hyperandrogenism':true,'oligo_amenorrhea':true,'polycystic_ovaries_us':true,'insulin_resistance':'present','metformin_started':true,'provider':'endo_001','next_review':7}],
];

let sh = '#!/bin/bash\nH=http://127.0.0.1:3000\nP=0;F=0\n';
smokeCases.forEach(([nm, ep, body], i) => {
  fs.writeFileSync(`C:/tmp/endo_body_${i}.json`, JSON.stringify(body));
  sh += `C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_${i}.json "$H${ep}")\nif [ "$C" = "200" ]; then echo "OK ${nm}"; P=$((P+1)); else echo "FAIL ${nm} ($C)"; fi\n`;
});
sh += 'echo PASS=$P FAIL=$F\n';
fs.writeFileSync('sm_endo_tier76.sh', sh);
console.log('Created', total, 'routers');
console.log('Smoke cases:', smokeCases.length);
