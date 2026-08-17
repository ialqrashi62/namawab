// filepath: gen_tier57.js
const fs = require('fs');

const routes = [
  [318, 'img_advanced', 'pet_ct,pet_mri,spect_ct,mr_spectroscopy,fusion_imaging'],
  [319, 'img_us_ext', 'us_musculoskeletal,us_thyroid,us_vascular_dvt,us_obstetric_advanced,us_contrast'],
  [320, 'img_breast', 'mammography_diagnostic,breast_mri,breast_ultrasound,breast_biopsy_stereo,breast_ductogram'],
  [321, 'img_msk', 'joint_mri,spine_imaging,bone_scan,three_tesla_mri,arthrogram_mri'],
  [322, 'img_emergent', 'ct_trauma_full,ct_angio_emergent,ct_perfusion,xr_portable_intraop,mri_emergent'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier57_imaging_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier57_imaging_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier57_imaging_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['i_pct','/api/img_advanced/pet_ct',{patient_id:'IM1','tracer':'fdg','indication':'cancer_staging','area':'whole_body','suv_max_lesion':8.5,'interpretation':'hypermetabolic_lesion_likely_malignant','follow_up':'biopsy_considered'}],
  ['i_pmr','/api/img_advanced/pet_mri',{patient_id:'IM2','tracer':'fdg','indication':'brain_tumor_recurrence','area':'brain','mri_sequences':'t1_t2_flair_dwi_post_contrast','interpretation':'no_recurrence','follow_up_imaging':6}],
  ['i_spc','/api/img_advanced/spect_ct',{patient_id:'IM3','tracer':'tc99m_mdp','indication':'bone_metastasis_workup','area':'skeletal','findings':'no_osteoblastic_metastases','interpretation':'stable'}],
  ['i_mrs','/api/img_advanced/mr_spectroscopy',{patient_id:'IM4','indication':'brain_lesion_differentiation','voxel_location':'left_temporal','choline':2.5,'naa':1.5,'creatine':1.0,'interpretation':'consistent_with_low_grade_glioma'}],
  ['i_fus','/api/img_advanced/fusion_imaging',{patient_id:'IM5','type':'pet_ct_mri','indication':'head_neck_cancer','registration_accuracy_mm':2,'findings':'primary_tumor_with_one_positive_node','staging':'t2_n1_m0'}],

  ['i_msk','/api/img_us_ext/us_musculoskeletal',{patient_id:'IU1','joint':'shoulder','findings':'full_thickness_supraspinatus_tear','bursa':'fluid','biceps':'intact','recommendation':'orthopedic_referral','follow_up':4}],
  ['i_thy','/api/img_us_ext/us_thyroid',{patient_id:'IU2','finding':'tirads_4_nodule_right_lower','size_mm':12,'recommendation':'fna_biopsy','lymph_nodes':'normal','follow_up_imaging':3}],
  ['i_dvt','/api/img_us_ext/us_vascular_dvt',{patient_id:'IU3','site':'left_lower_leg','finding':'acute_dvt_posterior_tibial','compressibility':'not_compressible','recommendation':'anticoagulation_immediate','follow_up':1}],
  ['i_obs','/api/img_us_ext/us_obstetric_advanced',{patient_id:'IU4','gestational_age_weeks':20,'anatomy_scan':'complete_normal','growth_percentile':45,'cervical_length_mm':38,'placenta':'fundal','recommendation':'routine_follow_up'}],
  ['i_cus','/api/img_us_ext/us_contrast',{patient_id:'IU5','indication':'liver_lesion_characterization','lesion_count':1,'enhancement_pattern':'arterial_washout','interpretation':'likely_hcc','recommendation':'mri_liver_for_confirmation'}],

  ['i_mam','/api/img_breast/mammography_diagnostic',{patient_id:'IB1','indication':'palpable_mass_right','birads':4,'findings':'suspicious_mass_15mm_right_upper_outer','recommendation':'image_guided_biopsy','follow_up':'core_needle_biopsy_planned'}],
  ['i_bmr','/api/img_breast/breast_mri',{patient_id:'IB2','indication':'high_risk_screening','birads':1,'background_parenchymal_enhancement':'minimal','incidental_findings':'none','follow_up_annual':true}],
  ['i_bus','/api/img_breast/breast_ultrasound',{patient_id:'IB3','indication':'palpable_mass_left','birads':4,'lesion_size_mm':14,'features':'irregular_margins','recommendation':'core_needle_biopsy'}],
  ['i_bbs','/api/img_breast/breast_biopsy_stereo',{patient_id:'IB4','indication':'calcifications','approach':'stereotactic','target':'cluster_right_outer','cores':6,'clip_placed':true,'complications':'none'}],
  ['i_bdg','/api/img_breast/breast_ductogram',{patient_id:'IB5','indication':'nipple_discharge_bleed','findings':'single_duct_filling_defect','recommendation':'surgical_consult_excision','follow_up':2}],

  ['i_jmr','/api/img_msk/joint_mri',{patient_id:'IK1','joint':'knee','indication':'meniscal_pathology','findings':'medial_meniscus_complex_tear','ligaments':'acl_intact','recommendation':'orthopedic_referral','follow_up':2}],
  ['i_spi','/api/img_msk/spine_imaging',{patient_id:'IK2','region':'lumbar','modality':'mri','findings':'moderate_degenerative_disc_l4_l5','disc_height':'mild_loss','nerve_root_compression':'right_l5','recommendation':'conservative_treatment'}],
  ['i_bsc','/api/img_msk/bone_scan',{patient_id:'IK3','tracer':'tc99m_mdp','indication':'bone_metastasis_workup','whole_body':'performed','findings':'two_areas_increased_activity_spine_pelvis','recommendation':'correlation_with_ct_mri','follow_up':2}],
  ['i_3tm','/api/img_msk/three_tesla_mri',{patient_id:'IK4','indication':'brain_mri_high_resolution','area':'brain','findings':'no_pathology','contrast_used':false,'recommendation':'none_needed','follow_up':1}],
  ['i_art','/api/img_msk/arthrogram_mri',{patient_id:'IK5','joint':'shoulder','indication':'labral_tear_evaluation','contrast':'gadolinium_intraarticular','findings':'posterior_labral_tear','recommendation':'orthopedic_referral'}],

  ['i_ctt','/api/img_emergent/ct_trauma_full',{patient_id:'IE1','indication':'polytrauma_mvc','scans':'head_c_spine_chest_abdomen_pelvis','contrast':'with','findings':'splenic_laceration_grade_3_l2_burst_fracture','recommendation':'trauma_surgery_consult','follow_up_imaging':1}],
  ['i_cte','/api/img_emergent/ct_angio_emergent',{patient_id:'IE2','indication':'gi_bleed_active','findings':'active_extravasation_gastric','recommendation':'emergent_angioembolization','follow_up':0}],
  ['i_ctp','/api/img_emergent/ct_perfusion',{patient_id:'IE3','indication':'acute_stroke_lvo','penumbra_volume_ml':85,'core_volume_ml':18,'mismatch':'present','recommendation':'thrombectomy_candidate'}],
  ['i_xrp','/api/img_emergent/xr_portable_intraop',{patient_id:'IE4','indication':'or_placement_confirmation','view':'ap','findings':'line_tip_at_cavoatrial_junction','recommendation':'position_acceptable','follow_up_imaging':0}],
  ['i_mre','/api/img_emergent/mri_emergent',{patient_id:'IE5','indication':'acute_spine_trauma','region':'cervical_thoracic','findings':'cord_signal_normal_no_fracture','recommendation':'collar_maintain_orthopedic_consult','follow_up':1}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\img_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_img_tier57.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);