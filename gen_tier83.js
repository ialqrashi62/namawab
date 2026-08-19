// filepath: gen_tier83.js
const fs = require('fs');
const path = require('path');

const mods = [
  { name: 'derm_general', eng: 438, base: 0,
    eps: ['skin_exam','rash_eval','skin_biopsy','derm_visit','topical_prescription'] },
  { name: 'derm_onc', eng: 439, base: 5,
    eps: ['melanoma_eval','bcc_scc','lymphoma','keratinocyte','derm_chemo'] },
  { name: 'derm_immuno', eng: 440, base: 10,
    eps: ['psoriasis','eczema','dermatitis','acne','biologics'] },
  { name: 'derm_cosmetic', eng: 441, base: 15,
    eps: ['botox','chemical_peel','laser','fillers','micro_needling'] },
  { name: 'derm_peds', eng: 442, base: 20,
    eps: ['pediatric_eczema','congenital_nevi','birthmarks','atopic','papular'] }
];

const bodies = [
  // 0 skin_exam
  {patient_id:'D0',assessment_id:'da_00',skin_type:'iii',lesion_count:25,lesion_distribution:'trunk_arms',moles_present:true,abcde_suspicious:false,fitzpatrick:'iii',impression:'benign_nevi',recommendation:'routine_followup',provider:'derm_001',next_review:12},
  // 1 rash_eval
  {patient_id:'D1',visit_id:'dv_01',rash_type:'macular',duration_days:5,distribution:'trunk',fever:false,pruritus:true,triggers:'new_detergent',contact_history:true,diagnosis:'contact_dermatitis',treatment:'topical_steroid',provider:'derm_001',next_review:7},
  // 2 skin_biopsy
  {patient_id:'D2',procedure_id:'dp_02',site:'right_arm',biopsy_type:'excisional',size_mm:8,local_anesthesia:true,indication:'r/o_melanoma',path_result:'benign_nevus',recommendation:'reassure',hospital_stay_hours:1,provider:'derm_001',next_review:14},
  // 3 derm_visit
  {patient_id:'D3',visit_id:'dv_03',patient_age:35,consult_type:'followup',chief_complaint:'psoriasis',exam_findings:'plaques',derm_score:'pasi',score_value:8.5,impression:'moderate_plaque_psoriasis',treatment_plan:'topical_then_biologic',provider:'derm_001',next_review:30},
  // 4 topical_prescription
  {patient_id:'D4',medication_id:'dm_04',medication:'calcipotriene',dosage:50,frequency:'bid',duration_weeks:8,body_surface_area:true,location:'trunk',indication:'plaque_psoriasis',insurance_covered:true,provider:'derm_001',next_review:30},
  // 5 melanoma_eval
  {patient_id:'D5',assessment_id:'da_05',lesion_location:'back',breslow_depth_mm:1.2,clark_level:'iii',ulceration:false,mitotic_rate:2,t_stage:'t2',breslow_grade:'1to2mm',braf_status:'wild_type',treatment:'wide_excision',surgical_margin:'1cm',provider:'derm_001',next_review:14},
  // 6 bcc_scc
  {patient_id:'D6',assessment_id:'da_06',cancer_type:'bcc',subtype:'nodular',tumor_size_cm:1.2,location:'head_neck',recurrent:false,treatment:'mohs',follow_up_weeks:4,pathology:'bcc_clear_margins',provider:'derm_001',next_review:30},
  // 7 lymphoma
  {patient_id:'D7',assessment_id:'da_07',type:'mycosis_fungoides',stage:'ib',skin_findings:'patches_plaques',treatment:'topical_steroid_nb_uvb',radiation_consult:true,systemic_therapy:false,follow_up_weeks:12,recommendation:'continue_nb_uvb',provider:'derm_001',next_review:90},
  // 8 keratinocyte
  {patient_id:'D8',assessment_id:'da_08',skin_type:'ii',actinic_keratoses_count:15,non_melanoma_history:2,sunscreen_use:false,field_treatment_done:true,field_treatment_type:'photodynamic',chemo_prevention:false,surveillance_plan:'annual_skin_exam',solid_organ_transplant:false,immunosuppression:'none',provider:'derm_001',next_review:90},
  // 9 derm_chemo
  {patient_id:'D9',assessment_id:'da_09',cancer_type:'melanoma',regimen:'pembrolizumab',cycle_number:6,complications:'thyroid',neutrophil_count:3500,admission_required:false,treatment_response:'partial',follow_up_weeks:12,recommendation:'continue_therapy',provider:'derm_001',next_review:30},
  // 10 psoriasis
  {patient_id:'D10',visit_id:'dv_10',pasi_score:12,bsa_pct:15,type:'plaque',joint_involvement:true,comorbidities:'psoriatic_arthritis',treatment:'methotrexate_then_biologic',biologic_started:true,dlqi_score:15,provider:'derm_001',next_review:30},
  // 11 eczema
  {patient_id:'D11',visit_id:'dv_11',scorad_score:45,bsa_pct:25,intense_itch:true,sleep_disturbance:true,type:'atopic',triggers:'stress_wool',treatment:'topical_steroid_then_phototherapy',phototherapy_started:true,dlqi_score:18,provider:'derm_001',next_review:30},
  // 12 dermatitis
  {patient_id:'D12',visit_id:'dv_12',type:'contact_allergic',affected_areas:'hands',prior_episodes:true,patch_testing_done:true,allergens_identified:'nickel',treatment:'avoidance_topical_steroid',phototherapy_started:false,dlqi_score:12,provider:'derm_001',next_review:30},
  // 13 acne
  {patient_id:'D13',visit_id:'dv_13',age:18,type:'nodulocystic',lesion_count_inflammatory:25,lesion_count_non_inflammatory:30,scarring_present:true,treatment:'isotretinoin',isotretinoin_started:true,mental_health_screen:true,provider:'derm_001',next_review:30},
  // 14 biologics
  {patient_id:'D14',medication_id:'dm_14',medication:'secukinumab',dose_mg:300,frequency:'monthly',tb_screen_done:1,tb_recent:false,pregnancy_test_done:true,vaccinations_current:true,follow_up_weeks:12,efficacy_score:'clear',provider:'derm_001',next_review:90},
  // 15 botox
  {patient_id:'D15',procedure_id:'dp_15',indication:'cosmetic_glabella',units:20,sites_count:5,pre_treatment_photo:true,treatment_zone:'glabella',complications:'none',treatment_time_min:15,follow_up_weeks:12,insurance_covered:false,provider:'derm_001',next_review:90},
  // 16 chemical_peel
  {patient_id:'D16',procedure_id:'dp_16',peel_type:'tca_medium',depth:'medium',layers:3,skin_indication:'photoaging',healing_days:7,sunscreen_prescribed:true,post_peel_infection:false,outcome:'excellent',follow_up_weeks:4,recommendation:'second_session',provider:'derm_001',next_review:30},
  // 17 laser
  {patient_id:'D17',procedure_id:'dp_17',laser_type:'ipl',indication:'pigmentation',fluence_j_cm2:15,spot_size_mm:8,treatment_area:'face',sessions:3,complications:'erythema',eye_protection_used:true,follow_up_weeks:4,provider:'derm_001',next_review:30},
  // 18 fillers
  {patient_id:'D18',procedure_id:'dp_18',filler_type:'ha',indication:'nasolabial',volume_ml:1,cannula_used:1,treatment_zone:'face',complications:'none',reversal_agent_available:true,follow_up_weeks:4,provider:'derm_001',next_review:90},
  // 19 micro_needling
  {patient_id:'D19',procedure_id:'dp_19',needle_depth_mm:1.5,radiofrequency_added:true,prp_added:true,indication:'acne_scars',sessions_recommended:4,sessions_completed:2,healing_days:3,outcome:'good',follow_up_weeks:4,sunscreen_prescribed:true,provider:'derm_001',next_review:30},
  // 20 pediatric_eczema
  {patient_id:'D20',visit_id:'dv_20',age_months:12,scorad_score:35,bsa_pct:30,sleep_disturbance:true,food_allergies:true,family_history_atopy:true,triggers:'milk_wool',treatment:'topical_steroid_bleach_bath',bleach_bath_started:true,provider:'derm_001',next_review:30},
  // 21 congenital_nevi
  {patient_id:'D21',assessment_id:'da_21',size_cm:8,location:'trunk',subtype:'medium',dermatology_referral:true,mri_done:false,follow_up_weeks:24,excision_planned:false,risk:'intermediate',provider:'derm_001',next_review:90},
  // 22 birthmarks
  {patient_id:'D22',assessment_id:'da_22',type:'hemangioma',size_cm:2,location:'face',growth_phase:true,phase:'proliferating',treatment:'propranolol',laser_started:false,beta_blocker_therapy:true,provider:'derm_001',next_review:30},
  // 23 atopic
  {patient_id:'D23',visit_id:'dv_23',age_years:5,scorad_score:30,asthma:true,allergic_rhinitis:true,food_allergies:true,family_history:true,triggers:'dust_pollen',treatment:'topical_steroid_antihistamine',bleach_bath_started:true,moisturizer_use:true,provider:'derm_001',next_review:30},
  // 24 papular
  {patient_id:'D24',visit_id:'dv_24',age_months:24,diagnosis:'molluscum',distribution:'trunk',contagious:true,treatment:'observation_then_cantharidin',cantharidin_used:false,healing_days:14,response:'stable',provider:'derm_001',next_review:30}
];

for (let i = 0; i < bodies.length; i++) {
  fs.writeFileSync(`C:/tmp/derm_body_${i}.json`, JSON.stringify(bodies[i]));
}
for (const m of mods) {
  const router = `// filepath: tier83_derm_ext_${m.eng}_${m.name}_router.js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./tier83_derm_ext_${m.eng}_${m.name}_engine');
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
  fs.writeFileSync(path.join(__dirname, `tier83_derm_ext_${m.eng}_${m.name}_router.js`), router);
}
console.log(`Wrote ${bodies.length} bodies and ${mods.length} routers`);
