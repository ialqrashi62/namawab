// filepath: gen_tier82.js
const fs = require('fs');
const path = require('path');

const mods = [
  { name: 'obgyn_antenatal', eng: 433, base: 0,
    eps: ['antenatal_initial','antenatal_followup','high_risk_preg','rhesus_isoimmunization','multiples'] },
  { name: 'obgyn_gyne', eng: 434, base: 5,
    eps: ['menstrual_disorder','infertility_eval','contraception_counseling','menopause','pelvic_pain'] },
  { name: 'obgyn_onc', eng: 435, base: 10,
    eps: ['cervical_screening','ovarian_cyst','endometrial_cancer','cervical_cancer','brca_counseling'] },
  { name: 'obgyn_labor', eng: 436, base: 15,
    eps: ['labor_admission','labor_monitoring','vaginal_delivery','cesarean_section','postpartum_care'] },
  { name: 'obgyn_repro', eng: 437, base: 20,
    eps: ['ivf_cycle','iui_cycle','recurrent_pregnancy_loss','pcos_eval','endometriosis'] }
];

const bodies = [
  // 0 antenatal_initial
  {patient_id:'OB0',visit_id:'ov_00',gestational_age_weeks:12,gravida:1,para:0,bmi:24,diabetes:false,hypertension:false,medications:'prenatal_vit',smoking:false,family_history:'none',allergies:'nkda',provider:'obgyn_001',next_review:4},
  // 1 antenatal_followup
  {patient_id:'OB1',visit_id:'ov_01',gestational_age_weeks:24,weight_kg:65,blood_pressure_systolic:120,blood_pressure_diastolic:80,fundal_height:24,fetal_heart_rate:140,fetal_movement:'active',symptoms:'none',medications:'vit',provider:'obgyn_001',next_review:4},
  // 2 high_risk_preg
  {patient_id:'OB2',assessment_id:'oa_02',gestational_age_weeks:32,risk_factors:'gdm',current_diagnosis:'gdm_a1',maternal_age_advanced:true,previous_preterm:false,blood_pressure_systolic:130,fundal_height:32,fetal_growth:'appropriate',recommendation:'increased_surveillance',follow_up:'2wks',provider:'obgyn_001',next_review:14},
  // 3 rhesus_isoimmunization
  {patient_id:'OB3',assessment_id:'oa_03',gestational_age_weeks:28,blood_type:'o_negative',antibody_titer:8,antibody_type:'anti_d',previous_affected_pregnancies:1,amnio_mcdonald_done:true,mca_peak_systolic_velocity:45,delta_od_450:0.2,management:'monitor',provider:'obgyn_001',next_review:14},
  // 4 multiples
  {patient_id:'OB4',assessment_id:'oa_04',gestational_age_weeks:20,chorionicity:'dichorionic_diamniotic',twins:2,ttts_suspected:false,twin_aneamia_polycythemia:false,cervical_length_mm:35,cerclage_planned:false,delivery_target_weeks:37,provider:'obgyn_001',next_review:14},
  // 5 menstrual_disorder
  {patient_id:'OB5',visit_id:'ov_05',disorder_type:'menorrhagia',cycle_length_days:28,flow_duration_days:8,hirsutism:true,bmi:28,imaging_done:'us',hormonal_workup:true,treatment_plan:'combined_ocp',provider:'obgyn_001',next_review:30},
  // 6 infertility_eval
  {patient_id:'OB6',assessment_id:'oa_06',age:32,bmi:26,amh:2.5,fsh_day3:7,cycle_length_days:30,partner_evaluation:true,tubal_patency:'bilateral_patent',duration_infertility_years:2,management:'iui',provider:'obgyn_001',next_review:30},
  // 7 contraception_counseling
  {patient_id:'OB7',visit_id:'ov_07',age:25,parity:0,smoker:false,hypertension:false,diabetes:false,method:'combined_pill',counseling:'completed',follow_up:'3mo',provider:'obgyn_001',next_review:90},
  // 8 menopause
  {patient_id:'OB8',visit_id:'ov_08',age:52,fsh:80,estradiol:25,stage:'menopause',vasomotor_symptoms:true,bone_density_test:true,hrt_status:'started',bone_density_score:'osteopenia',treatment:'hrt_and_diet',provider:'obgyn_001',next_review:90},
  // 9 pelvic_pain
  {patient_id:'OB9',visit_id:'ov_09',pain_score:7,duration_months:12,cyclic:true,associated_symptoms:'dyspareunia',imaging_done:true,impression:'endometriosis',management:'combined_ocp_then_surgery',recommendation:'laparoscopy',provider:'obgyn_001',next_review:30},
  // 10 cervical_screening
  {patient_id:'OB10',assessment_id:'oa_10',age:35,pap_smear_result:'lsil',hpv_test:'positive',hpv_strain:'other_high_risk',colposcopy_done:true,colposcopy_findings:'low_grade',biopsy_done:true,biopsy_result:'cin1',recommendation:'followup_12mo',provider:'obgyn_001',next_review:52},
  // 11 ovarian_cyst
  {patient_id:'OB11',assessment_id:'oa_11',laterality:'right',cyst_size_cm:6,complexity:'complex',ca125:18,roma_score:7,mri_done:true,management:'surgical_elective',follow_up:'2wks',provider:'obgyn_001',next_review:14},
  // 12 endometrial_cancer
  {patient_id:'OB12',assessment_id:'oa_12',age:65,bmi:35,endometrial_thickness_mm:8,postmenopausal_bleeding:true,diabetes:true,lynch_syndrome:false,stage:'ia',grade:'g2',treatment:'hysterectomy',surgery_planned:true,provider:'obgyn_001',next_review:14},
  // 13 cervical_cancer
  {patient_id:'OB13',assessment_id:'oa_13',stage:'ib1',subtype:'squamous',hpv_related:true,treatment:'surgery',surgery_planned:true,fertility_sparing:false,follow_up_weeks:4,provider:'obgyn_001',next_review:28},
  // 14 brca_counseling
  {patient_id:'OB14',assessment_id:'oa_14',age:38,family_history:'mother_brca',brca_test_status:1,gene_mutated:'brca1',lifetime_cancer_risk:70,management:'surveillance',referred_genetic_counselor:true,counseling_complete:'completed',provider:'obgyn_001',next_review:90},
  // 15 labor_admission
  {patient_id:'OB15',visit_id:'ov_15',gestational_age_weeks:39,cervical_dilation_cm:3,cervical_effacement_pct:60,fetal_heart_rate:140,contractions:'moderate',rom_present:false,epidural_given:0,gbs_status_known:true,provider:'obgyn_001',next_review:1},
  // 16 labor_monitoring
  {patient_id:'OB16',visit_id:'ov_16',cervical_dilation_cm:6,stage:'active',contraction_frequency_min:3,fetal_heart_rate:140,fetal_variability:12,category:'cat1',oxytocin_running:true,iu_pressure:20,provider:'obgyn_001',next_review:1},
  // 17 vaginal_delivery
  {patient_id:'OB17',procedure_id:'op_17',delivery_type:'spontaneous_vaginal',gestational_age_weeks:39,labor_induction:'spontaneous',anesthesia:'epidural',operative_time_min:30,perineal_laceration:'second',blood_loss_ml:400,complications:'none',skin_to_skin:true,provider:'obgyn_001',next_review:1},
  // 18 cesarean_section
  {patient_id:'OB18',surgery_id:'os_18',c_section_type:'primary',gestational_age_weeks:38,operative_time_min:45,ebl_ml:600,anesthesia:'spinal',indication:'failure_to_progress',complications:'none',hospital_stay_days:3,recommendation:'routine_postpartum',provider:'obgyn_001',next_review:42},
  // 19 postpartum_care
  {patient_id:'OB19',visit_id:'ov_19',postpartum_day:7,mode_of_delivery:'vaginal',breastfeeding:true,lochia:'normal',postpartum_depression_score:5,episiotomy_healed:true,fundal_height:0,follow_up_plan:'6wk_pp_visit',provider:'obgyn_001',next_review:42},
  // 20 ivf_cycle
  {patient_id:'OB20',cycle_id:'oc_20',cycle_number:1,eggs_retrieved:12,eggs_mature:10,eggs_fertilized:8,blastocysts_formed:5,embryo_quality:'good',endometrial_thickness_mm:8,days_of_stim:10,progesterone_route:'vaginal',pregnancy_achieved:true,provider:'obgyn_001',next_review:14},
  // 21 iui_cycle
  {patient_id:'OB21',cycle_id:'oc_21',cycle_number:2,follicles_grown:2,endometrial_thickness_mm:9,medication:'clomid',total_motile_sperm_million:10,sperm_wash_done:true,pregnancy_achieved:false,beta_hcg_initial:1,beta_hcg_48h:1,provider:'obgyn_001',next_review:14},
  // 22 recurrent_pregnancy_loss
  {patient_id:'OB22',assessment_id:'oa_22',previous_losses:3,gestational_age_last_loss:8,karyotype_done:true,thrombophilia_workup:true,uterine_anomaly_workup:true,amh:2.5,aps_workup:true,couple_karyotype:true,findings:'unexplained',management:'progesterone',provider:'obgyn_001',next_review:30},
  // 23 pcos_eval
  {patient_id:'OB23',visit_id:'ov_23',age:28,bmi:32,oligo_amenorrhea:true,hyperandrogenism_bio:true,ultrasound_polycystic:true,lh_fsh_ratio:3,fasting_insulin:25,homa_ir:6,metformin_started:true,first_line:'metformin',provider:'obgyn_001',next_review:30},
  // 24 endometriosis
  {patient_id:'OB24',assessment_id:'oa_24',age:30,asrm_score:30,stage:'moderate',laparoscopy_done:true,histologic_confirmation:true,ultrasound_finding:5,infertility_associated:true,management:'gnrh_agonist',referred_repro:true,provider:'obgyn_001',next_review:30}
];

for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:/tmp/ob_body_${i}.json`, JSON.stringify(bodies[i]));
}
for (const m of mods) {
  const router = `// filepath: tier82_obgyn_ext_${m.eng}_${m.name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier82_obgyn_ext_${m.eng}_${m.name}_engine');
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
  fs.writeFileSync(path.join(__dirname, `tier82_obgyn_ext_${m.eng}_${m.name}_router.js`), router);
}
console.log(`Wrote ${bodies.length} bodies and ${mods.length} routers`);
