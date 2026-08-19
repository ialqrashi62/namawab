// filepath: gen_tier73.js
const fs = require('fs');

const routes = [
  [383, 'cardio_ep', 'cardiac_cath,electrophysiology_study,ablation,device_implant,wearable_loop_recorder'],
  [384, 'cardio_imaging', 'echo_complete,stress_echo,stress_nuclear,ct_angiography_coronary,cardiac_mri'],
  [385, 'cardio_chf', 'chf_intake,chf_medication_titration,chf_followup,chf_decompensation,chf_advanced_therapies'],
  [386, 'cardio_rehab', 'cardiac_rehab_intake,exercise_prescription,cardiac_rehab_progress,cardiac_rehab_discharge,remote_cardiac_monitoring'],
  [387, 'cardio_prevention', 'lipid_management,hypertension_specialist,cardiovascular_risk_assessment,antiplatelet_management,smoking_cessation_cardiac'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier73_cardio_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier73_cardio_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier73_cardio_ext_' + n + '_' + name + '_router.js', code);
  total++;
});

const smokeCases = [
  ['c_cath','/api/cardio_ext_ep/cardiac_cath',{patient_id:'CD1','cath_id':'cath_001','access_site':'radial_right','approach':'radial','lesion_count':2,'stents_placed':1,'contrast_used_ml':120,'fluoro_time_min':18,'complications':'none','length_of_stay_overnight':true,'operator':'dr_card_001','lesion_locations':'LAD','planned_pci':true}],
  ['c_eps','/api/cardio_ext_ep/electrophysiology_study',{patient_id:'CD2','study_id':'eps_001','indication':'syncope','baseline_rhythm':'sinus','arrhythmia_induced':'avnrt','inducible':true,'vascular_access':'femoral_right','catheters_used':'decapolar_quad','duration_min':120,'ablation_performed':true,'complications':'none','operator':'dr_ep_001'}],
  ['c_abl','/api/cardio_ext_ep/ablation',{patient_id:'CD3','ablation_id':'abl_001','arrhythmia':'avnrt','energy_source':'rf','target':'slow_pathway','mapping_system':'carto_3','lesions_delivered':5,'success_achieved':true,'acute_success':true,'procedure_duration_min':150,'complications':'none','long_term_success_prob':0.95,'operator':'dr_ep_002'}],
  ['c_dev','/api/cardio_ext_ep/device_implant',{patient_id:'CD4','device_id':'dev_001','device_type':'icd','manufacturer':'medtronic','model':'evera_x3','indication':'primary_prevention','ef_pct':25,'nyha_class':2,'generator_site':'left_pectoral','leads_count':2,'complications':'none','duration_min':90,'fluoro_time_min':8,'operator':'dr_ep_003','follow_up_due':7}],
  ['c_wl','/api/cardio_ext_ep/wearable_loop_recorder',{patient_id:'CD5','device_id':'wlr_001','indication':'cryptogenic_stroke','manufacturer':'medtronic','model':'reveal_linq','inserted':'2026-08-15','transmission_active':true,'arrhythmia_detected':'afib','adherence_pct':95,'battery_years_left':3,'follow_up_months':36,'monitoring_physician':'dr_ep_001'}],
  ['c_ec','/api/cardio_ext_imaging/echo_complete',{patient_id:'CD6','study_id':'echo_001','ef_pct':35,'wall_motion_abnormalities':'inferior_hypokinesis','valve_heart_disease':'mild_mr','diastolic_dysfunction':true,'pulmonary_pressure':35,'imaging_quality':'adequate','contrast_used':false,'recommendation':'follow_up_3_months','sonographer':'sono_001','reading_physician':'dr_echo_001'}],
  ['c_se','/api/cardio_ext_imaging/stress_echo',{patient_id:'CD7','study_id':'se_001','protocols':'dobutamine','baseline_ef_pct':40,'peak_ef_pct':45,'wall_motion_at_peak':'normal','ischemia_detected':false,'reason_stopped':'target_heart_rate','complications':'none','recommendation':'medical_therapy','sonographer':'sono_002','reading_physician':'dr_echo_002'}],
  ['c_sn','/api/cardio_ext_imaging/stress_nuclear',{patient_id:'CD8','study_id':'sn_001','tracer':'technetium_99m','protocol':'pharmacologic','risk_score':5,'summed_diff_score':12,'ischemia_extent':'moderate','ef_pct':42,'lung_uptake':false,'recommendation':'cath','complications':'none','reading_physician':'dr_nuc_001','return_baseline':true}],
  ['c_ccta','/api/cardio_ext_imaging/ct_angiography_coronary',{patient_id:'CD9','study_id':'ccta_001','agatston_score':210,'cad_rads_category':3,'lesion_count':2,'lesion_severity':'50_70','high_risk_plaque':false,'recommendation':'functional_test','reader_confidence':'high','dose_msv':3.5,'contrast_volume_ml':80,'reading_physician':'dr_ct_001'}],
  ['c_cmr','/api/cardio_ext_imaging/cardiac_mri',{patient_id:'CD10','study_id':'cmr_001','indication':'myocarditis','ef_pct':50,'late_gad_enhancement_present':true,'lge_pattern':'subepicardial','t1_mapping_abnormal':true,'t2_mapping_abnormal':true,'edema_present':true,'recommendation':'follow_up_3_months','reading_physician':'dr_cmr_001','study_quality':'adequate'}],
  ['c_chf_i','/api/cardio_ext_chf/chf_intake',{patient_id:'CD11','intake_id':'ci_001','chf_type':'hfref','ef_pct':28,'nyha_class':3,'etiologies':'ischemic','primary_care_physician':'dr_a','gdmt_initiated':'entresto_beta_bloker_mra_diuretic','medication_tolerated':true,'education_provided':true,'device_planned':'icd','follow_up_plan':7}],
  ['c_chf_mt','/api/cardio_ext_chf/chf_medication_titration',{patient_id:'CD12','chf_id':'ci_001','medication':'entresto','current_dose':'24_26','target_dose':'97_103','lab_values':'k_4.5_cr_1.2','titration_tolerance':'good','next_titration_due':14,'patient_symptoms':'stable','provider':'dr_chf_001','next_labs_due':14}],
  ['c_chf_fu','/api/cardio_ext_chf/chf_followup',{patient_id:'CD13','chf_id':'ci_001','follow_up_day':14,'weight_kg':78,'weight_change_kg':-1,'symptoms':'improved','nyha_class':2,'med_changes':'none','labs_reviewed':true,'patient_adherence_pct':95,'next_follow_up':14,'provider':'dr_chf_001'}],
  ['c_chf_d','/api/cardio_ext_chf/chf_decompensation',{patient_id:'CD14','event_id':'chf_dec_001','trigger':'medication_nonadherence','weight_gain_kg':3,'dyspnea_severity':'moderate','edema_present':true,'hospitalized':true,'length_of_stay_days':4,'interventions':'iv_diuretic','plan':'biPAP_initiated','caregiver_involvement':true,'provider':'dr_chf_001'}],
  ['c_chf_at','/api/cardio_ext_chf/chf_advanced_therapies',{patient_id:'CD15','therapies_considered':'lvad','transplant_evaluation_status':'completed','lvad_candidate':true,'transplant_candidate':false,'palliative_care_consult':true,'advanced_directive_signed':true,'goals_of_care_documented':true,'next_review':30,'provider':'dr_chf_002','decision_made_by':'team'}],
  ['c_crei','/api/cardio_ext_rehab/cardiac_rehab_intake',{patient_id:'CD16','referral_id':'cr_ref_001','diagnosis':'nstem','referral_date':'2026-08-15','phase':'1','risk_level':'moderate','initial_visit_date':'2026-08-20','peak_vo2':18,'muscle_strength_assessed':true,'goals_set':'increase_vo2','barriers':'transportation','program_duration_weeks':12}],
  ['c_exrx','/api/cardio_ext_rehab/exercise_prescription',{patient_id:'CD17','prescription_id':'rx_001','modality':'treadmill','intensity':'moderate','target_hr':120,'duration_min':30,'frequency_per_week':3,'progression':'gradual','warnings':'staff_present','rescue_meds_available':'nitroglycerin','signed_by':'dr_card_001','next_review':4}],
  ['c_crp','/api/cardio_ext_rehab/cardiac_rehab_progress',{patient_id:'CD18','prescription_id':'rx_001','sessions_completed':12,'sessions_goal':36,'adherence_pct':90,'current_vo2':20,'vo2_baseline':18,'pain_free':true,'medication_changes':'none','goal_progress':'on_track','next_review_date':'2026-09-01','provider':'dr_card_001'}],
  ['c_crd','/api/cardio_ext_rehab/cardiac_rehab_discharge',{patient_id:'CD19','discharge_id':'cr_dc_001','sessions_completed':36,'program_duration_weeks':12,'met_goals':true,'vo2_improvement_pct':25,'maintenance_plan':'home_exercise','community_program_referred':true,'risk_reduction_strategies':'diet_exercise','follow_up':'cardiology_3_months','discharge_provider':'dr_card_001'}],
  ['c_rcm','/api/cardio_ext_rehab/remote_cardiac_monitoring',{patient_id:'CD20','monitor_id':'rm_001','device':'bluetooth_bp_monitor','readings_per_week':14,'adherence_pct':88,'avg_bp':'128_78','alert_events':1,'provider_reviewed':true,'action_taken':'medication_continued','next_review':7,'platform':'hf_engage'}],
  ['c_lm','/api/cardio_ext_prevention/lipid_management',{patient_id:'CD21','patient_id_field':'MRN0789','ldl_current':110,'ldl_goal':70,'statin_type':'atorvastatin','statin_dose_mg':40,'current_intensity':'moderate','statin_intolerance':false,'side_effects':'none','add_on_therapy':'ezetimibe','risk_category':'high','next_labs_months':3}],
  ['c_hs','/api/cardio_ext_prevention/hypertension_specialist',{patient_id:'CD22','referral_id':'htn_001','bp_average':'154_92','bp_uncontrolled_on_meds':3,'medications_count':4,'secondary_cause_evaluated':true,'renal_artery_stenosis_ruled_out':true,'aldosterone_renin_ratio':12,'sleep_study_ordered':true,'plan':'add_mineralocorticoid','specialist':'dr_htn_001','follow_up':14}],
  ['c_cvr','/api/cardio_ext_prevention/cardiovascular_risk_assessment',{patient_id:'CD23','ascvd_score':18.5,'risk_category':'high','risk_factors':'htn_dyslipidemia_family_history','lifestyle_factors':'sedentary_high_sodium','biomarkers_reviewed':'hs_crp_lp_a','imaging_reviewed':'cimt_elevated','preventive_interventions':'statin_initiated','shared_decision_making':true,'next_review_months':6,'provider':'dr_cv_001'}],
  ['c_ap','/api/cardio_ext_prevention/antiplatelet_management',{patient_id:'CD24','agent':'aspirin','dose_mg':81,'indication':'primary_prevention','bleeding_risk_assessed':'low','thrombotic_risk':'low','plavix_concomitant':false,'statin_concomitant':true,'gi_protection':'ppi','duration_months':12,'plan':'continue','provider':'dr_cv_001','next_review':6}],
  ['c_sc','/api/cardio_ext_prevention/smoking_cessation_cardiac',{patient_id:'CD25','patient_id_field':'MRN2000','smoking_status':'former','pack_years':20,'years_since_last_smoked':1,'previous_quit_attempts':3,'method':'varenicline','pharmacotherapy_adherence':0.85,'counseling_completed':true,'support_call_done':true,'co_intervention':'cvd_meds_adherence','follow_up_months':3,'next_review':7}],
];

let sh = '#!/bin/bash\nH=http://127.0.0.1:3000\nP=0;F=0\n';
smokeCases.forEach(([nm, ep, body], i) => {
  fs.writeFileSync(`C:/tmp/cardio_body_${i}.json`, JSON.stringify(body));
  sh += `C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_${i}.json "$H${ep}")\nif [ "$C" = "200" ]; then echo "OK ${nm}"; P=$((P+1)); else echo "FAIL ${nm} ($C)"; fi\n`;
});
sh += 'echo PASS=$P FAIL=$F\n';
fs.writeFileSync('sm_cardio_tier73.sh', sh);
console.log('Created', total, 'routers');
console.log('Smoke cases:', smokeCases.length);
