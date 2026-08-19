// filepath: gen_tier79.js
const fs = require('fs');
const path = require('path');

const mods = [
  { name: 'ophth_general', eng: 418, base: 0,
    eps: ['vision_screening','refraction','iop_check','dilate_exam','routine_exam'] },
  { name: 'ophth_retina', eng: 419, base: 5,
    eps: ['diabetic_retinopathy','amd_management','retinal_detachment','intravitreal_injection','oct_scan'] },
  { name: 'ophth_cataract', eng: 420, base: 10,
    eps: ['cataract_eval','cataract_surgery','pre_op_assessment','post_op_care','yag_capsulotomy'] },
  { name: 'ophth_glaucoma', eng: 421, base: 15,
    eps: ['glaucoma_initial','visual_field','oct_rnfl','glaucoma_medication','glaucoma_surgery'] },
  { name: 'ophth_pediatric', eng: 422, base: 20,
    eps: ['pediatric_exam','amblyopia','strabismus','retinopathy_prematurity','pediatric_cataract'] }
];

const bodies = [
  // 0 vision_screening
  {patient_id:'OP0',visit_id:'ov_00',va_right:20,va_left:20,va_both:20,sph_right:-1.5,sph_left:-1.0,cyl_right:-0.5,cyl_left:0,add_power:1.5,iop_right:14,iop_left:15,glasses_recommendation:'progressive',provider:'oph_001',next_review:12},
  // 1 refraction
  {patient_id:'OP1',visit_id:'ov_01',sph_right:-2.0,sph_left:-1.75,cyl_right:-0.75,cyl_left:-0.5,axis_right:180,axis_left:175,add_right:1.5,add_left:1.5,refraction_method:'manifest',va_right_final:20,va_left_final:20,provider:'oph_001',next_review:12},
  // 2 iop_check
  {patient_id:'OP2',visit_id:'ov_02',iop_right:16,iop_left:15,pachymetry_right:550,pachymetry_left:548,method:'gton',corneal_compensation:true,gla_risk:'low',recommendation:'routine_screening',provider:'oph_001',next_review:12},
  // 3 dilate_exam
  {patient_id:'OP3',visit_id:'ov_03',dilating_agent:'tropicamide',pupil_size_mm:8,duration_min:30,lens_findings:'clear',fundus_findings:'normal',fundus_photo_taken:true,oct_taken:false,provider:'oph_001',next_review:12},
  // 4 routine_exam
  {patient_id:'OP4',visit_id:'ov_04',va_right:20,va_left:20,iop_right:14,iop_left:15,anterior_segment:'normal',posterior_segment:'normal',impression:'healthy_eye_exam',treatment_plan:'annual_followup',provider:'oph_001',next_review:52},
  // 5 diabetic_retinopathy
  {patient_id:'OP5',assessment_id:'oa_05',hba1c:7.5,dr_grade:'moderate_npdR',macular_edema:true,cmt_central:380,oct_done:true,fundus_photo:true,anti_vegf_planned:true,laterality:'right',recommendation:'observe_then_avastin',provider:'oph_001',next_review:8},
  // 6 amd_management
  {patient_id:'OP6',visit_id:'ov_06',amd_type:'wet',cmt_central:420,intravitreal_avastin:true,intravitreal_lucentis:false,intravitreal_eylea:false,intravitreal_izervay:false,cnt_va:0.3,laterality:'right',injection_number:3,provider:'oph_001',next_review:6},
  // 7 retinal_detachment
  {patient_id:'OP7',assessment_id:'oa_07',type:'rhegmatogenous',laterality:'left',macula_off:false,vitreous_hemorrhage:false,va:20,treatment:'vitrectomy',surgery_planned:true,provider:'oph_001',next_review:14},
  // 8 intravitreal_injection
  {patient_id:'OP8',procedure_id:'op_08',medication:'avastin',dose_mg:1.25,laterality:'right',injection_number:4,complications:'none',va_pre:0.4,va_post:0.5,provider:'oph_001',next_review:6},
  // 9 oct_scan
  {patient_id:'OP9',study_id:'os_09',laterality:'right',cmt_central:280,subretinal_fluid:false,intraretinal_fluid:true,epiretinal_membrane:false,macular_hole:false,impression:'diabetic_me',recommendation:'continue_anti_vegf',image_quality:8,provider:'oph_001',next_review:4},
  // 10 cataract_eval
  {patient_id:'OP10',assessment_id:'oa_10',laterality:'right',va_pre:0.5,nuclear_grade:'iii',cortical_grade:'moderate',psc_grade:'none',glc_symptoms:true,glc_visible:false,corneal_endothelium:2400,treatment:'surgery_planning',provider:'oph_001',next_review:14},
  // 11 cataract_surgery
  {patient_id:'OP11',surgery_id:'os_11',laterality:'right',lens_model:'monofocal',lens_power:22,anesthesia:'topical',operative_time_min:18,complications:'none',va_day_one:20,hospital_stay_hours:4,provider:'oph_001',next_review:7},
  // 12 pre_op_assessment
  {patient_id:'OP12',assessment_id:'oa_12',biometry_done:true,al:24.5,keratometry_k1:43.5,keratometry_k2:44.0,ac_depth:3.2,lens_thickness:4.5,wtw:11.8,iol_formula:'barrett',corneal_pathology:false,laterality:'right',provider:'oph_001',next_review:7},
  // 13 post_op_care
  {patient_id:'OP13',visit_id:'ov_13',laterality:'right',va_current:20,va_target:20,iop:14,anterior_chester_reaction:false,cme_status:'none',drops_compliance:true,cystoid_status:'none',complications:'none',postop_day:30,provider:'oph_001',next_review:30},
  // 14 yag_capsulotomy
  {patient_id:'OP14',procedure_id:'op_14',laterality:'right',va_pre:0.6,va_post:0.2,laser_energy_mj:2.5,complications_count:0,complication_type:'none',yag_opening_size:3,iop_spike:false,iop_post:16,recommendation:'continue_drops',provider:'oph_001',next_review:7},
  // 15 glaucoma_initial
  {patient_id:'OP15',assessment_id:'oa_15',laterality:'bilateral',iop_right:22,iop_left:24,cct_right:550,cct_left:548,cup_ratio_right:'p0_7',cup_ratio_left:'p0_6',gla_type:'poag',recommendation:'start_med',provider:'oph_001',next_review:14},
  // 16 visual_field
  {patient_id:'OP16',study_id:'os_16',laterality:'right',md:-6.5,psd:4.2,reliability:'reliable',pattern:'arcuate',progression:false,impression:'glaucomatous_defect',recommendation:'continue_meds',test_duration_min:10,provider:'oph_001',next_review:24},
  // 17 oct_rnfl
  {patient_id:'OP17',study_id:'os_17',laterality:'right',rnfl_avg:72,rnfl_sup:78,rnfl_inf:65,classification:'yellow',progression:true,image_quality:9,impression:'rnfl_thinning_inferotemporal',recommendation:'optimize_meds',provider:'oph_001',next_review:12},
  // 18 glaucoma_medication
  {patient_id:'OP18',medication_id:'on_18',medication:'latanoprost',dosage_drop:1,frequency:'qd',iop_baseline:24,iop_current:16,side_effects:'redness',adherence:'good',provider:'oph_001',next_review:12},
  // 19 glaucoma_surgery
  {patient_id:'OP19',surgery_id:'os_19',procedure:'trabeculectomy',laterality:'right',iop_pre:28,iop_target:14,bleb_formation:true,needling_required:false,complications:'none',hospital_stay_hours:24,provider:'oph_001',next_review:14},
  // 20 pediatric_exam
  {patient_id:'OP20',visit_id:'ov_20',age_years:5,laterality:'bilateral',va_method:'lea_symbols',va_result:'20_30',cycloplegic_refraction_sph:2.0,alignment:'orthotropia',red_reflex:'normal',parent_concerns:'none',provider:'oph_001',next_review:12},
  // 21 amblyopia
  {patient_id:'OP21',assessment_id:'oa_21',age_years:6,laterality:'right',va_affected:0.5,va_unaffected:0.0,treatment:'patching',patch_hours_per_day:4,compliance_pct:85,barriers:'none',response:'improving',provider:'oph_001',next_review:8},
  // 22 strabismus
  {patient_id:'OP22',assessment_id:'oa_22',type:'esotropia',angle_prism_diopter:25,age_onset_years:3,management:'surgery',surgery_planned:true,surgical_target_diopter:20,binocular_function:'reduced',stereoacuity:'reduced',provider:'oph_001',next_review:30},
  // 23 retinopathy_prematurity
  {patient_id:'OP23',assessment_id:'oa_23',gestational_age_weeks:28,birth_weight_grams:1100,age_at_exam_weeks:8,stage:'stage_2',zone:'zone_2',plus_disease:'absent',treatment_required:false,anti_vegf_given:false,laser_done:false,provider:'oph_001',next_review:14},
  // 24 pediatric_cataract
  {patient_id:'OP24',assessment_id:'oa_24',age_years:2,laterality:'left',cataract_type:'congenital',surgery_indicated:true,surgery_age_months:18,ioL_planned:false,contact_lens_cl:true,patching_required:'unilateral',genetic_testing:'negative',provider:'oph_001',next_review:14}
];

for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:/tmp/oph_body_${i}.json`, JSON.stringify(bodies[i]));
}

for (const m of mods) {
  const router = `// filepath: tier79_ophth_ext_${m.eng}_${m.name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier79_ophth_ext_${m.eng}_${m.name}_engine');
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
  fs.writeFileSync(path.join(__dirname, `tier79_ophth_ext_${m.eng}_${m.name}_router.js`), router);
}

console.log(`Wrote ${bodies.length} bodies and ${mods.length} routers`);
