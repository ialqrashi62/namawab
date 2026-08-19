// filepath: gen_tier80.js
const fs = require('fs');
const path = require('path');

const mods = [
  { name: 'ent_general', eng: 423, base: 0,
    eps: ['ent_clinic','audiometry','hearing_aid','cochlear_impl','ent_referral'] },
  { name: 'ent_sinus', eng: 424, base: 5,
    eps: ['sinusitis_eval','sinus_surgery','allergic_rhinitis','epistaxis','nasal_endoscopy'] },
  { name: 'ent_throat', eng: 425, base: 10,
    eps: ['tonsillitis','tonsillectomy','obstructive_sleep_apnea','laryngitis_reflux','voice_therapy'] },
  { name: 'ent_head_neck', eng: 426, base: 15,
    eps: ['thyroid_nodule','thyroidectomy','neck_mass','salivary_gland','head_neck_cancer'] },
  { name: 'ent_pediatric', eng: 427, base: 20,
    eps: ['otitis_media','myringotomy','adenoidectomy','newborn_hearing','congenital_neck_mass'] }
];

const bodies = [
  // 0 ent_clinic
  {patient_id:'ET0',visit_id:'ev_00',complaint:'hearing_loss',duration_months:6,bilateral:true,exam_findings:'cerumen_impaction',diagnosis:'cerumen',treatment_plan:'irrigation',medications:'none',laterality:'bilateral',provider:'ent_001',next_review:7},
  // 1 audiometry
  {patient_id:'ET1',study_id:'es_01',ac_threshold_right_500:25,ac_threshold_left_500:30,ac_threshold_right_1000:30,ac_threshold_left_1000:30,ac_threshold_right_2000:35,ac_threshold_left_2000:35,ac_threshold_right_4000:40,ac_threshold_left_4000:40,loss_type_right:'mild',loss_type_left:'mild',loss_pattern:'sensorineural',provider:'ent_001',next_review:24},
  // 2 hearing_aid
  {patient_id:'ET2',device_id:'ed_02',ear:'bilateral',model:'m70',manufacturer:'phonak',fit_date:20260301,real_ear_gain_db:25,hour_per_day_use:12,adjustments_made:true,comfort_feedback:'good',provider:'ent_001',next_review:12},
  // 3 cochlear_impl
  {patient_id:'ET3',device_id:'ed_03',side:'right',brand_model:'cochlear_nucleus',implant_date:20260301,activation_done:true,speech_score_pre:10,speech_score_post:75,mapping_done:true,rehabilitation_hours:40,complications:'none',provider:'ent_001',next_review:12},
  // 4 ent_referral
  {patient_id:'ET4',referral_id:'er_04',referring_provider:'pcp_001',specialty:'otology',reason:'persistent_drainage',urgency:'routine',clinical_question:'need_hearing_aid',pertinent_findings:'tympanic_perforation',workup_done:'audiogram',provider:'ent_001',next_review:14},
  // 5 sinusitis_eval
  {patient_id:'ET5',assessment_id:'ea_05',sin_diagnosis:'chronic',duration_weeks:16,symptoms:'nasal_obstruction',purulent_discharge:true,ct_lund_mackay:8,ct_done:true,aspirin_sensitive:false,nasal_polyps:true,severity:'moderate',recommendation:'fess',provider:'ent_001',next_review:14},
  // 6 sinus_surgery
  {patient_id:'ET6',surgery_id:'es_06',procedure:'functional_endoscopic',side:'bilateral',indication:'chronic_sinusitis',operative_time_min:90,ebl_ml:100,complications:'none',hospital_stay_hours:6,recommendation:'daily_saline',provider:'ent_001',next_review:7},
  // 7 allergic_rhinitis
  {patient_id:'ET7',visit_id:'ev_07',seasonality:'perennial',triggers:'dust',conjunctivitis:true,asthma:false,skin_test_done:true,allergens:'dust_mite',treatment:'antihistamine',immunotherapy_started:true,intranasal_steroid:true,provider:'ent_001',next_review:12},
  // 8 epistaxis
  {patient_id:'ET8',assessment_id:'ea_08',severity:'mild',location:'anterior',side:'left',duration_minutes:15,intervention:'pressure',cautery_done:true,packing_done:false,estimated_blood_loss:50,hypotension:false,recurred:false,treatment:'cautery',provider:'ent_001',next_review:7},
  // 9 nasal_endoscopy
  {patient_id:'ET9',procedure_id:'ep_09',tolerance:8,findings_documented:true,nasal_findings:'mucosal_edema',septum_status:'deviated_right',polyps_present:false,drainage:'clear',impression:'allergic_rhinitis',degree_of_visibility:'excellent',recommendation:'continue_steroid',provider:'ent_001',next_review:14},
  // 10 tonsillitis
  {patient_id:'ET10',visit_id:'ev_10',severity:'moderate',centor_score:3,strep_test_positive:true,fever_present:true,tonsillar_exudate:true,lymphadenopathy:true,treatment:'amoxicillin',abscess_present:false,referred_surgery:false,provider:'ent_001',next_review:7},
  // 11 tonsillectomy
  {patient_id:'ET11',surgery_id:'es_11',indication:'recurrent_tonsillitis',technique:'cold_dissection',operative_time_min:45,ebl_ml:50,complications:'none',pod_diet_resume:3,hospital_stay_hours:8,discharge_plan:'home',provider:'ent_001',next_review:14},
  // 12 obstructive_sleep_apnea
  {patient_id:'ET12',assessment_id:'ea_12',aahi:28,severity:'severe',sleep_study_done:true,lowest_o2:78,symptoms:'snoring',cpap_started:true,bariatric_consult:false,surgical_referral:true,recommendation:'uppp',provider:'ent_001',next_review:30},
  // 13 laryngitis_reflux
  {patient_id:'ET13',visit_id:'ev_13',laryngeal_findings:'erythema',reflux_symptom_index:15,ppi_started:true,diet_lifestyle:true,voice_therapy:false,smoking_cessation:true,follow_up_weeks:8,recommendation:'continue_ppi',provider:'ent_001',next_review:60},
  // 14 voice_therapy
  {patient_id:'ET14',visit_id:'ev_14',voice_handicap_index:45,diagnosis:'vocal_nodules',stroboscopy_done:true,therapy_modalities:'resonant_voice',session_count:6,improvement_score:15,surgical_discussed:false,treatment_response:'improving',provider:'ent_001',next_review:14},
  // 15 thyroid_nodule
  {patient_id:'ET15',assessment_id:'ea_15',nodule_size_mm:15,location:'right',tirads:'tr4',fna_done:true,bethesda:'iv',molecular_test:true,recommendation:'hemithyroidectomy',provider:'ent_001',next_review:14},
  // 16 thyroidectomy
  {patient_id:'ET16',surgery_id:'es_16',scope:'total',operative_time_min:120,ebl_ml:75,complications:'none',rln_intact:true,hospital_stay_days:1,calcium_post:8.5,finding:'goiter',pathology:'multinodular_goiter',provider:'ent_001',next_review:14},
  // 17 neck_mass
  {patient_id:'ET17',assessment_id:'ea_17',mass_size_cm:3,location:'level_ii',tenderness:false,fixed:false,matted_nodes:false,imaging:'ct',fna_done:true,diagnosis:'reactive_node',follow_up_weeks:4,provider:'ent_001',next_review:30},
  // 18 salivary_gland
  {patient_id:'ET18',assessment_id:'ea_18',gland:'parotid',side:'right',mass_size_cm:2.5,symptoms:'painless_mass',diagnosis:'pleomorphic_adenoma',surgery_planned:true,treatment_plan:'superficial_parotidectomy',provider:'ent_001',next_review:14},
  // 19 head_neck_cancer
  {patient_id:'ET19',assessment_id:'ea_19',cancer_type:'oropharyngeal',stage:'t2n1m0',hpv_status:'positive',treatment:'surgery_xrt',surgery_planned:true,radiation_planned:true,chemo_planned:false,mdt_referral:'completed',provider:'ent_001',next_review:14},
  // 20 otitis_media
  {patient_id:'ET20',visit_id:'ev_20',age_months:24,ear:'right',type:'recurrent',tympanostomy_tubes_placed:false,antibiotics:false,severity:'mild',episodes_per_year:5,hearing_loss:true,recommendation:'observation',provider:'ent_001',next_review:14},
  // 21 myringotomy
  {patient_id:'ET21',procedure_id:'ep_21',age_months:18,side:'bilateral',tubes_placed:true,tube_type:'shah',anesthesia:'mask',operative_time_min:15,complications:'none',tonsillectomy_done:false,adenoidectomy_done:false,provider:'ent_001',next_review:14},
  // 22 adenoidectomy
  {patient_id:'ET22',surgery_id:'es_22',age_years:4,combined_with_tonsillectomy:false,indication:'obstruction',operative_time_min:30,ebl_ml:30,complications:'none',hospital_stay_hours:6,discharge_plan:'home',provider:'ent_001',next_review:14},
  // 23 newborn_hearing
  {patient_id:'ET23',assessment_id:'ea_23',screening_age_days:2,screening_type:'abr',screening_result:'pass',unilateral_refer:false,bilateral_refer:false,followup_needed:false,risk_factors:'none',recommendation:'routine_followup',provider:'ent_001',next_review:12},
  // 24 congenital_neck_mass
  {patient_id:'ET24',assessment_id:'ea_24',age_years:8,type:'thyroglossal_duct',mass_size_cm:2,location:'midline',infectious_episodes:true,surgical_planned:true,follow_up_weeks:2,recommendation:'sistrunk_procedure',provider:'ent_001',next_review:30}
];

for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:/tmp/ent_body_${i}.json`, JSON.stringify(bodies[i]));
}
for (const m of mods) {
  const router = `// filepath: tier80_ent_ext_${m.eng}_${m.name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier80_ent_ext_${m.eng}_${m.name}_engine');
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
  fs.writeFileSync(path.join(__dirname, `tier80_ent_ext_${m.eng}_${m.name}_router.js`), router);
}
console.log(`Wrote ${bodies.length} bodies and ${mods.length} routers`);
