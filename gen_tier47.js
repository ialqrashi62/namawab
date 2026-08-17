// filepath: gen_tier47.js
const fs = require('fs');

const routes = [
  [268, 'rad_body', 'ct_chest,mri_abdomen,ct_abdomen,us_abdomen,us_pelvis'],
  [269, 'rad_neuro', 'ct_head,mri_brain,mri_spine,ct_angiography,mra_head'],
  [270, 'rad_cardio', 'ct_angio_coronary,cardiac_mri,echo_stress,mri_perfusion,nuclear_cardiology'],
  [271, 'rad_gu_gi', 'ct_urogram,mri_prostate,mri_rectum,defecography,urodynamics_imaging'],
  [272, 'rad_interv', 'biopsy_ct_guided,drainage_catheter,embolization_therapy,tumor_ablation,vertebroplasty'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier47_radiology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier47_radiology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier47_radiology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['r_chs','/api/rad_body/ct_chest',{patient_id:'R1',indication:'lung_nodule_followup',protocol:'low_dose_screening',findings:'stable_6mm_node_ulr',birads:2,follow_up:6}],
  ['r_abd','/api/rad_body/mri_abdomen',{patient_id:'R2',indication:'liver_mass',protocol:'hepatobiliary_phase',findings:'focal_nodule_2cm_likely_hemangioma',li_rads:'lr1',follow_up:6}],
  ['r_cta','/api/rad_body/ct_abdomen',{patient_id:'R3',indication:'appendicitis',protocol:'with_iv_contrast',findings:'normal_appendix_no_free_fluid',radiation_dose:'low_dose',outcome:'avoided_surgery'}],
  ['r_us','/api/rad_body/us_abdomen',{patient_id:'R4',indication:'gallstones',findings:'multiple_mobile_stones_normal_wall',gallbladder_wall_mm:3,common_duct_mm:5,follow_up:'none_needed'}],
  ['r_pel','/api/rad_body/us_pelvis',{patient_id:'R5',indication:'pelvic_pain',findings:'normal_uterus_ovaries',free_fluid:false,follow_up:'none'}],

  ['r_hea','/api/rad_neuro/ct_head',{patient_id:'RN1',indication:'headache',findings:'no_acute_intracranial_pathology',mass_effect:false,hemorrhage:false,follow_up:'discharge_with_precautions'}],
  ['r_mbr','/api/rad_neuro/mri_brain',{patient_id:'RN2',indication:'ms_surveillance',protocol:'with_without_contrast',findings:'no_new_lesions_stable',white_matter_lesions:8,follow_up:12}],
  ['r_msp','/api/rad_neuro/mri_spine',{patient_id:'RN3',indication:'lumbago_radiculopathy',level:'l4_l5',findings:'moderate_left_neural_foraminal_stenosis',disc_height:'preserved',cord_signal:'normal',recommendation:'conservative'}],
  ['r_cta','/api/rad_neuro/ct_angiography',{patient_id:'RN4',indication:'stroke_workup',findings:'left_mca_m1_occlusion',collaterals:'fair',recommendation:'thrombectomy_candidate',complications:'none'}],
  ['r_mra','/api/rad_neuro/mra_head',{patient_id:'RN5',indication:'aneurysm_screen',findings:'no_aneurysm',variants:'hypoplastic_a1_left',recommendation:'no_follow_up_needed'}],

  ['r_ctc','/api/rad_cardio/ct_angio_coronary',{patient_id:'RC1',indication:'chest_pain_low_risk',cad_rads:1,plaque:'none',stenosis:'none',recommendation:'no_follow_up_5_years'}],
  ['r_cmr','/api/rad_cardio/cardiac_mri',{patient_id:'RC2',indication:'myocarditis_suspected',protocol:'lake_louis',findings:'subepicardial_lge_basal_lateral',ef_percent:48,edema_present:true,recommendation:'avoid_exercise_3_months'}],
  ['r_str','/api/rad_cardio/echo_stress',{patient_id:'RC3',indication:'ischemia_evaluation',protocol:'dobutamine',resting_ef:55,stress_ef:62,wall_motion:'normal',ischemia:'none',recommendation:'no_cath'}],
  ['r_per','/api/rad_cardio/mri_perfusion',{patient_id:'RC4',indication:'ischemia_detection',rest_perfusion:'normal',stress_perfusion:'defect_anterior',ischemia:'present',recommendation:'cath_referral'}],
  ['r_nuc','/api/rad_cardio/nuclear_cardiology',{patient_id:'RC5',indication:'cad_evaluation',protocol:'spect',srs:5,reversible_defect:false,fixed_defect:false,recommendation:'low_risk'}],

  ['r_uro','/api/rad_gu_gi/ct_urogram',{patient_id:'RG1',indication:'hematuria',findings:'small_renal_cyst_left_2cm_bosniak_1',mass:false,stones:false,follow_up:12}],
  ['r_prs','/api/rad_gu_gi/mri_prostate',{patient_id:'RG2',indication:'psa_elevation',psa:7.5,protocol:'mpmri',pirads:4,lesion_location:'peripheral_zone_posterior',recommendation:'fusion_biopsy'}],
  ['r_rec','/api/rad_gu_gi/mri_rectum',{patient_id:'RG3',indication:'rectal_cancer_staging',t_stage:'t3',n_stage:'n1',mesorectal_fascia:'threatened',neoadjuvant_chemoradiation:'planned'}],
  ['r_def','/api/rad_gu_gi/defecography',{patient_id:'RG4',indication:'obstructed_defecation',finding:'rectocele_3cm_intussusception',recommendation:'biofeedback_consider_surgery',follow_up:6}],
  ['r_udn','/api/rad_gu_gi/urodynamics_imaging',{patient_id:'RG5',indication:'incontinence',finding:'detrusor_overactivity_with_leakage',recommendation:'anticholinergic_pt',follow_up:3}],

  ['r_bio','/api/rad_interv/biopsy_ct_guided',{patient_id:'RI1',target:'lung_nodule_1.5cm',approach:'posterior',needles:3,core_samples:5,complication:'small_pneumothorax_observed',histology_pending:true}],
  ['r_drn','/api/rad_interv/drainage_catheter',{patient_id:'RI2',collection:'subphrenic_abscess_4cm',approach:'percutaneous',catheter_size_fr:10,output:'decreasing',follow_up:'serial_imaging'}],
  ['r_emb','/api/rad_interv/embolization_therapy',{patient_id:'RI3',target:'splenic_artery_aneurysm',material:'coils',success:true,complications:'none',follow_up_imaging:3}],
  ['r_abl','/api/rad_interv/tumor_ablation',{patient_id:'RI4',target:'liver_met_2cm',modality:'microwave',approach:'percutaneous',success:true,complications:'none',follow_up_imaging:4}],
  ['r_vrt','/api/rad_interv/vertebroplasty',{patient_id:'RI5',level:'l1',indication:'compression_fracture_painful',approach:'transpedicular_bilateral',cement_ml:4,complications:'none',pain_improvement:'yes'}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\rad_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_rad_tier47.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);