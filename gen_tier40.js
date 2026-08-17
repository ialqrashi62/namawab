// filepath: gen_tier40.js
const fs = require('fs');

const routes = [
  [233, 'glaucoma', 'glaucoma_diagnosis,glaucoma_treatment,glaucoma_progression,glaucoma_surgery,iop_monitoring'],
  [234, 'retina', 'amd,diabetic_retinopathy,retinal_detachment,macular_edema,intravitreal_injection'],
  [235, 'cornea', 'keratitis,corneal_ulcer,dry_eye,keratoconus,corneal_transplant'],
  [236, 'oculoplast', 'ptosis,blepharitis,orbital_tumor,thyroid_eye_disease,lacrimal_obstruction'],
  [237, 'neuro_ophth', 'optic_neuritis,papilledema,visual_field_defect,double_vision,anterior_ischemic_optic_neuropathy'],
];

let total = 0;
routes.forEach(([n, name, eps]) => {
  const epsArr = eps.split(',').map(e => `'${e}'`).join(',');
  const code = `// filepath: tier40_ophthalmology_ext_${n}_${name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier40_ophthalmology_ext_${n}_${name}_engine');
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
  fs.writeFileSync('tier40_ophthalmology_ext_' + n + '_' + name + '_router.js', code);
  total++;
});
console.log('Created', total, 'routers');

const cases = [
  ['o_gd','/api/ophth_glaucoma/glaucoma_diagnosis',{patient_id:'G1',iop_right:24,iop_left:18,cup_disc_ratio_right:0.6,visual_field:'mild_defect_superior',angle:'open',family_history:true}],
  ['o_gt','/api/ophth_glaucoma/glaucoma_treatment',{patient_id:'G2',diagnosis:'poag',current_drug:'latanoprost',compliance:'good',side_effects:'none',target_iop:18}],
  ['o_gp','/api/ophth_glaucoma/glaucoma_progression',{patient_id:'G3',md_slope:-0.5,vfl_fast:false,oct_rnfl_thinning:true,follow_up_months:24,progression:'slow'}],
  ['o_gs','/api/ophth_glaucoma/glaucoma_surgery',{patient_id:'G4',type:'trabeculectomy',indication:'uncontrolled_iop',pre_iop:28,post_iop_target:15,complications:'none'}],
  ['o_iop','/api/ophth_glaucoma/iop_monitoring',{patient_id:'G5',last_iop:16,fluctuation:3,diurnal_curve_done:true,compliance:'good',next_review_3_months:true}],

  ['o_amd','/api/ophth_retina/amd',{patient_id:'R1',type:'wet',visual_acuity_right:20,visual_acuity:'20/40',oct_done:true,anti_vegf_initiated:'aflibercept',treatment_response:'stable'}],
  ['o_dr','/api/ophth_retina/diabetic_retinopathy',{patient_id:'R2',stage:'moderate_npdr',visual_acuity:'20/40',oct_macular_edema:false,follow_up_6_months:true,glycemic_control:'fair'}],
  ['o_rd','/api/ophth_retina/retinal_detachment',{patient_id:'R3',type:'rhegmatogenous',macula_off:true,surgery:'vitrectomy_with_buckle',urgent:true,visual_prognosis:'guarded'}],
  ['o_me','/api/ophth_retina/macular_edema',{patient_id:'R4',type:'diabetic',oct_cmt:450,visual_acuity:'20/60',anti_vegf:'ranibizumab',response:'partial'}],
  ['o_ivi','/api/ophth_retina/intravitreal_injection',{patient_id:'R5',drug:'aflibercept',eye:'left',pre_iop:16,post_iop:18,complications:'none',consent_obtained:true}],

  ['o_ker','/api/ophth_cornea/keratitis',{patient_id:'C1',type:'infectious',organism:'bacterial',contact_lens:true,corneal_infiltrate:true,treatment:'moxifloxacin',response:'improving'}],
  ['o_cu','/api/ophth_cornea/corneal_ulcer',{patient_id:'C2',depth:'deep_stromal',culture_done:true,organism:'pseudomonas',antibiotic:'fortified_gentamicin',scarring_risk:'high'}],
  ['o_de','/api/ophth_cornea/dry_eye',{patient_id:'C3',severity:'moderate',schirmer:8,tbut:6,treatment:'artificial_tears_cyclosporine',response:'partial'}],
  ['o_kc','/api/ophth_cornea/keratoconus',{patient_id:'C4',severity:'moderate',steepest_k:54,corneal_crosslinking_done:true,visual_acuity:'20/40',contact_lens:'scleral'}],
  ['o_ct','/api/ophth_cornea/corneal_transplant',{patient_id:'C5',type:'dmek',indication:'fuchs_dystrophy',donor_tissue:'available',rejection_risk:'moderate',post_op_drops:'pred_fk506'}],

  ['o_pto','/api/ophth_plas/ptosis',{patient_id:'P1',side:'right',severity:'moderate',mr_distance:2,etiology:'aponeurotic',surgery_planned:'levator_resection',functional_visual_loss:true}],
  ['o_ble','/api/ophth_plas/blepharitis',{patient_id:'P2',type:'posterior',lid_hygiene:'warm_compress',severity:'moderate',rosacea:false,ointment:'erythromycin',response:'partial'}],
  ['o_ot','/api/ophth_plas/orbital_tumor',{patient_id:'P3',location:'intraconal',imaging:'mri',biopsy:'cavernous_hemangioma',surgery_planned:'orbitotomy',complications:'none'}],
  ['o_ted','/api/ophth_plas/thyroid_eye_disease',{patient_id:'P4',activity:'active',cas_score:5,treatment:'iv_steroid',tepezza_consideration:false,orbital_decompression_planned:false}],
  ['o_lo','/api/ophth_plas/lacrimal_obstruction',{patient_id:'P5',type:'adult_nldo',probing_done:true,success:false,dacryocystorhinostomy_planned:true,follow_up:'1_month'}],

  ['o_on','/api/ophth_no/optic_neuritis',{patient_id:'N1',eye:'left',mri_lesion:'periventricular',visual_acuity:'20/200',iv_steroid_given:true,recovery:'improving'}],
  ['o_pe','/api/ophth_no/papilledema',{patient_id:'N2',bilateral:true,ct_venogram:'sinus_thrombosis',intracranial_pressure:35,treatment:'acetazolamide',weight_management:true}],
  ['o_vfd','/api/ophth_no/visual_field_defect',{patient_id:'N3',type:'bitemporal_hemianopia',mri_pituitary:'macroadenoma',hormonal_workup:'pending',refer_neurosurgery:true}],
  ['o_dv','/api/ophth_no/double_vision',{patient_id:'N4',type:'binocular',onset:'acute',cranial_nerve:'iii',pupil_involving:true,aneurysm_workup:'mra'}],
  ['o_aion','/api/ophth_no/anterior_ischemic_optic_neuropathy',{patient_id:'N5',eye:'right',type:'arteritic',esr:80,prednisone_started:true,dose_mg:60,biopsy_temporal_artery_planned:true}],
];

let lines = ['#!/bin/bash', 'H=http://127.0.0.1:3000', 'P=0;F=0'];
let i = 0;
cases.forEach(([name, url, body]) => {
  const fn = 'C:\\tmp\\ophth_body_' + i + '.json';
  fs.writeFileSync(fn, JSON.stringify(body));
  lines.push('C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_' + i + '.json "$H' + url + '")');
  lines.push('if [ "$C" = "200" ]; then echo "OK ' + name + '"; P=$((P+1)); else echo "FAIL ' + name + ' ($C)"; fi');
  i++;
});
lines.push('echo PASS=$P FAIL=$F');
fs.writeFileSync('sm_ophth_tier40.sh', lines.join('\n') + '\n');
console.log('Smoke cases:', cases.length);