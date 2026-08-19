// filepath: gen_tier77.js (v2 - bodies match engines)
const fs = require('fs');

// bodies keyed to engine field names exactly
const bodies = [
  // 0 stroke_initial
  {patient_id:'N00',visit_id:'nv_00',nihss_score:5,onset_time:'known_under_4_5h',thrombolysis_eligible:true,door_to_needle:45,ct_findings:'no_hemorrhage',risk_factors:'htn',medications:'aspirin',provider:'neuro_001',next_review:14},
  // 1 stroke_thrombolysis
  {patient_id:'N01',procedure_id:'np_01',door_to_needle_min:45,therapy_initiated:'tPA',hemorrhagic_conversion:false,nihss_24h:6,bp_systolic:130,bp_diastolic:85,complications:'none',recommendation:'continue_observation',provider:'neuro_001',next_review:7},
  // 2 stroke_post_care
  {patient_id:'N02',visit_id:'nv_02',day:1,nihss_score:5,aspirin_started:true,statin_started:true,rehab_screen:'passed',swallow_screen:'passed',bp_target_systolic:140,mobility_assessment:'indep_walker',dvt_prophylaxis:'heparin',provider:'neuro_001',next_review:3},
  // 3 stroke_rehab
  {patient_id:'N03',assessment_id:'na_03',rankin_score:2,barthel_index:80,physical_therapy_started:true,occupational_therapy_started:true,speech_therapy_started:false,sessions_per_week:5,goals:'independ_walk_30m',family_education:'complete',provider:'neuro_001',next_review:7},
  // 4 stroke_secondary_prevention
  {patient_id:'N04',assessment_id:'na_04',antiplatelet_started:true,statin_started:true,bp_target:'lt140_90',atrial_fib_anticoagulation:true,lifestyle_counseling:true,diet_recommendation:'med_diet',smoking_cessation:'quit',follow_up_weeks:12,provider:'neuro_001',next_review:12},
  // 5 epilepsy_initial
  {patient_id:'N05',visit_id:'nv_05',seizure_type:'focal',episode_count:4,last_seizure:'2026-07-15T12:00:00Z',triggers:'sleep_deprivation',duration_years:5,family_history:'none',medications:'levetiracetam',provider:'neuro_001',next_review:14},
  // 6 seizure_classification
  {patient_id:'N06',assessment_id:'na_06',seizure_type:'focal',ilae_classification:'focal_impaired_awareness',eeg_status:'abnormal',imaging_done:true,provoking_factors:'sleep_deprivation',frequency:'monthly',provider:'neuro_001',next_review:14},
  // 7 aed_management
  {patient_id:'N07',medication_id:'nm_07',aed_medication:'levetiracetam',aed_dose:500,aed_level_ng_ml:12,seizure_frequency:'monthly',side_effects:'mild',adherent:true,provider:'neuro_001',next_review:14},
  // 8 eeg_review
  {patient_id:'N08',study_id:'ns_08',eeg_findings:'epileptiform_left_temporal',activations_done:true,impression:'consistent_focal_epilepsy',duration_minutes:60,sleep_deprived:false,location:'left_temporal',provider:'neuro_001',next_review:14},
  // 9 epilepsy_surgery_eval
  {patient_id:'N09',assessment_id:'na_09',drug_resistant:true,failed_aed_count:3,localization:'left_temporal',surgical_eligibility:'candidate',wada_planned:true,intracranial_eeg_planned:false,surgical_procedure:'temporal_resection',provider:'neuro_001',next_review:30},
  // 10 movement_initial
  {patient_id:'N10',visit_id:'nv_10',movement_score:'moderate',tremor_rating:2,rigidity_score:1,bradykinesia_score:1,dyskinesia_present:false,symptoms:'resting_tremor',medications:'levodopa',provider:'neuro_001',next_review:14},
  // 11 parkinson_meds
  {patient_id:'N11',medication_id:'nm_11',medication:'levodopa_carbidopa',dose:300,frequency:'three_times_daily',on_off_status:'on',motor_score:30,hallucinations:false,provider:'neuro_001',next_review:14},
  // 12 dystonia_botox
  {patient_id:'N12',procedure_id:'np_12',indication:'cervical_dystonia',botox_units:200,botox_sites:5,effect_duration_weeks:12,dysphagia_post:false,response:'good',provider:'neuro_001',next_review:12},
  // 13 tremor_workup
  {patient_id:'N13',assessment_id:'na_13',tremor_location:'right_hand',tremor_type:'resting',tremor_rating:2,family_history:false,mri_ordered:true,dat_scan_done:false,recommendation:'start_therapy',provider:'neuro_001',next_review:14},
  // 14 deep_brain_stimulation
  {patient_id:'N14',assessment_id:'na_14',dbs_target:'stn',dbs_evaluated:true,psychiatric_clearance:true,mri_clearance:true,medication_reduction_pct:50,motor_improvement:true,battery_years_remaining:5,provider:'neuro_001',next_review:30},
  // 15 neuropathy_workup
  {patient_id:'N15',assessment_id:'na_15',neuropathy_type:'diabetic',mrc_sum_score:52,sensation_intact:false,reflexes:'reduced',ck_level:240,nerve_conduction_findings:'axonal',skin_biopsy_result:'pending',provider:'neuro_001',next_review:30},
  // 16 myasthenia_gravis
  {patient_id:'N16',assessment_id:'na_16',mg_adl_score:4,mg_qmg_score:6,acetylcholine_receptor_ab:true,musk_ab:false,ice_pack_test_pct:50,fvc_pct:75,treatment:'pyridostigmine_prednisone',thymectomy_status:'not_done',provider:'neuro_001',next_review:14},
  // 17 als_management
  {patient_id:'N17',assessment_id:'na_17',als_fvc_pct:75,als_fvc_trend:5,alsfrs_score:30,bulbar_score:8,riluzole_started:true,edaravone_started:true,non_invasive_ventilation:false,g_tube_placed:false,prognosis:'moderate',provider:'neuro_001',next_review:8},
  // 18 gbs_assessment
  {patient_id:'N18',assessment_id:'na_18',gbs_areflexia:true,gbs_nerve_conduction:'demyelinating',albuminocytologic_dissociation:true,gbs_variant:'aidp',ivig_started:true,plasmapheresis_done:false,mrc_sum_score:48,respiratory_failure_risk:true,provider:'neuro_001',next_review:7},
  // 19 cnm_referral
  {patient_id:'N19',assessment_id:'na_19',clinical_question:'evaluate_neuropathy',exam_type:'comprehensive',diagnosis:'diabetic_neuropathy',emg_requested:true,mri_requested:false,genetic_test_requested:false,special_findings:'sensorimotor',consult_specialty:'neuromuscular',provider:'neuro_001',next_review:30},
  // 20 headache_initial
  {patient_id:'N20',visit_id:'nv_20',headache_days_month:8,migraine_aura:true,triggers:'stress',family_history:'mother',disability_score:55,medications:'sumatriptan',red_flags:'none',provider:'neuro_001',next_review:30},
  // 21 migraine_prevention
  {patient_id:'N21',medication_id:'nm_21',prevent_med:'topiramate',target_dose:100,days_per_month_on_treatment:15,disability_score:30,started:true,tolerated:true,insurance_approval:'approved',provider:'neuro_001',next_review:30},
  // 22 cluster_headache
  {patient_id:'N22',assessment_id:'na_22',episode_duration_min:90,episodes_per_day:2,oxygen_therapy:true,oxygen_flow_lpm:15,sumitriptan_used:true,verapamil_started:true,verapamil_dose:240,galcanezumab_started:'pending',provider:'neuro_001',next_review:14},
  // 23 medication_overuse
  {patient_id:'N23',assessment_id:'na_23',overuse_med:'ibuprofen',overuse_days:20,overuse_count:25,disability_score:65,withdrawal_planned:true,bridge_therapy_started:true,started_date:'2026-08-01',patient_education:'completed',provider:'neuro_001',next_review:14},
  // 24 botox_for_migraine
  {patient_id:'N24',procedure_id:'np_24',botox_units:200,botox_sites:31,headache_days_month:10,trial_period_complete:true,insurance_approved:true,responded:true,follow_up_weeks:12,provider:'neuro_001',next_review:12}
];

for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:/tmp/neuro_body_${i}.json`, JSON.stringify(bodies[i]));
}
console.log(`Wrote ${bodies.length} bodies`);
